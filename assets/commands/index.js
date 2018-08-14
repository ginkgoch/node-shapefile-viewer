const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');
const CsvParser = require('../dep/json2csv.umd').Parser;
const { dialog, shell } = require('electron').remote;
const { Shapefile } = require('ginkgoch-shapefile-reader');
const TableEx = require('../utils/tableEx');
const LeafletEx = require('../utils/leafletEx');
const jsts = require('../dep/jsts.min');
const uris = require('../utils/uris');
const AlertEx = require('../utils/alertEx');
const AlertLevels = require('../utils/alertLevels');
const MessageBoard = require('../storage/MessageBoard');
const RecentlyFileEx = require('../utils/recentlyFileEx');
const LocalStorageEx = require('../utils/localStorageEx');
const extensionFilter = [ { name: 'Shapefiles (*.shp)', extensions: [ 'shp' ] } ];

module.exports = class Commands {
    static zoomIn() {
        G.map.zoomIn();
    }

    static zoomOut() {
        G.map.zoomOut();
    }

    static zoomToBounds() {
        if(G.mapState && G.mapState.envelope) {
            G.map.fitBounds(LeafletEx.envelopeToBounds(G.mapState.envelope));
        }
    }

    static gotoUri(uriKey) {
        return function() {
            shell.openExternal(uris[uriKey]);
        }
    }

    static clearHighlights() {
        LeafletEx.removeHighlights(G.map);
    }

    static submitFeedback() {
        const email = $('#feedbackInputEmail').val();
        const content = $('#feedbackTextareaContent').val();
        const message = new MessageBoard();
        message.set('email', email);
        message.set('content', content);
        message.save().then(() => {
            $('#feedbackInputEmail').val('');
            $('#feedbackTextareaContent').val('');
            $('#messageModalCenter').modal('hide');
            AlertEx.alert('Feedback submitted. Thank you.', AlertLevels.success);
        }, err => {
            $('#messageModalCenter').modal('hide');
            const errDetail = { title: 'Feedback sumbmitted failed.', message: err.message };
            AlertEx.alert(errDetail, AlertLevels.danger);
        });
    }

    static async toggleBaseMap() {
        const baseMapOn = !LocalStorageEx.getBaseMapOn();
        let baseLayer = await LeafletEx.getBaseLayer(G.map);
        if (baseMapOn && !baseLayer) {
            LeafletEx.loadBaseLayer(G.map);
        } else if (!baseMapOn && baseLayer) {
            baseLayer.remove();
        }

        LocalStorageEx.setBaseMapOn(baseMapOn);
        require('../utils/menuEx').setBaseMapOn(baseMapOn);
    }

    static async exportAsCsv() {
        if(!Commands._checkShapefileAvailable()) return;

        const saveFilePath = dialog.showSaveDialog({ defaultPath: `*/${path.basename(G.mapState.shapefile.filePath).replace(/\.shp/, '.csv')}`, filters: [{ name: 'Csv (*.csv)', extensions: ['csv'] }] });
        if(saveFilePath) {
            const fields = _.clone(G.mapState.fields);
            fields.push('geom');

            const jsonLayer = await LeafletEx.getJsonLayer(G.map);
            const features = jsonLayer.getLayers().map(l =>  l.feature).map(f => { 
                const geom = Commands._json2wkt(f);
                return _.merge({ geom }, f.properties); 
            });;
            const csvParser = new CsvParser({ fields });
            const csvContent = csvParser.parse(features);
            fs.writeFileSync(saveFilePath, csvContent, { encoding: 'utf8' });
            AlertEx.alert('Csv file exporting completed.', AlertLevels.success);
        }
    }

    static async exportAsGeoJson() {
        if(!Commands._checkShapefileAvailable()) return;

        const saveFilePath = dialog.showSaveDialog({ defaultPath: `*/${path.basename(G.mapState.shapefile.filePath).replace(/\.shp/, '.json')}`, filters: [{ name: 'GeoJSON (*.json)', extensions: ['json'] }] });
        if(saveFilePath) {
            const jsonLayer = await LeafletEx.getJsonLayer(G.map);
            const features = jsonLayer.getLayers().map(l =>  l.feature);
            const featureCollection = { type: 'FeatureCollection', features: features };
            const jsonContent = JSON.stringify(featureCollection, null, 2);
            fs.writeFileSync(saveFilePath, jsonContent, { encoding: 'utf8' });
            AlertEx.alert('GeoJson file exporting completed.', AlertLevels.success);
        }
    }

    static async openShapefile(filePath = undefined) {
        if (!_.isString(filePath) || _.isUndefined(filePath)) {
            filePath = dialog.showOpenDialog({ properties: ['openFile'], filters: extensionFilter });
            if(_.isUndefined(filePath) || filePath.length === 0) { return; }
            else { filePath = filePath[0]; }
        }

        if (!Commands._checkShapefilesExist(filePath)) { return; }
        
        G.mapState = { };
        G.mapState.shapefile = new Shapefile(filePath);
        await Commands._initView(G.mapState.shapefile);
        RecentlyFileEx.recordRecentlyOpened(filePath);
    }

    static async _initView(shapefile) {
        await shapefile.openWith(async () => {
            const total = await shapefile.count();
            const envelope = shapefile.envelope();
            const fields = shapefile.fields();
            const columns = fields.map(f => { return { field: f, title: f }; });
            
            G.progress.show();
            shapefile.eventEmitter = new EventEmitter();
            shapefile.eventEmitter.on('progress', (c, t) => G.progress.value(c * 100 / t));
            const features = await shapefile.records();
            shapefile.eventEmitter.removeAllListeners();
            shapefile.eventEmitter = null;
            G.progress.reset();
            
            const data = features.map(f => f.properties);
            const options = { columns, data, pagination: true, paginationVAlign: 'top' };
            G.table.bootstrapTable('destroy').bootstrapTable(options).on('click-row.bs.table', TableEx.rowSelected);
            
            const bounds = LeafletEx.envelopeToBounds(envelope);
            const featureCollection = { type: 'FeatureCollection', features };
            LeafletEx.loadJsonLayer(G.map, featureCollection).fitBounds(bounds);
            G.mapState = _.assign(G.mapState, { fields, total, envelope, columns, featureCollection });
        });
    }

    static _checkShapefilesExist(filePath) {
        const exts = ['.shp', '.shx', '.dbf'];
        const missingFiles = exts.map(ext => filePath.replace(/\.shp/i, ext)).map(f => {
            return fs.existsSync(f) ? { success: true } : { success: false, file: path.basename(f) };
        }).filter(r => !r.success).map(r => r.file);

        if(missingFiles && missingFiles.length > 0) {
            AlertEx.alert(missingFiles.join(', ') + ' cannot found.', AlertLevels.danger);
            return false;
        }

        return true;
    }

    static _checkShapefileAvailable() {
        if (!G.mapState || !G.mapState.shapefile) {
            dialog.showErrorBox('Shapefile is not loaded', `Please open a shapefile first.`);
            return false;
        }

        return true;
    }

    static _json2wkt(feature) {
        const jsonReader = new jsts.io.GeoJSONReader();
        const geom = jsonReader.read(feature).geometry;
        
        const wktWriter = new jsts.io.WKTWriter();
        const wkt = wktWriter.write(geom);
        return wkt;
    }
}