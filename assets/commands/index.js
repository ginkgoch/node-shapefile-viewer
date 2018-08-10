const fs = require('fs');
const os = require('os');
const path = require('path');
const CsvParser = require('../dep/json2csv.umd').Parser;
const { dialog, shell, Menu, MenuItem } = require('electron').remote;
const { Shapefile } = require('ginkgoch-shapefile-reader');
const TableEx = require('../utils/tableEx');
const LeafletEx = require('../utils/leafletEx');
const extensionFilter = [ { name: 'Shapefiles (*.shp)', extensions: [ 'shp' ] } ];
const jsts = require('../dep/jsts.min');
const uris = require('../utils/uris');
const AlertEx = require('../utils/alertEx');
const AlertLevels = require('../utils/alertLevels');
const MessageBoard = require('../storage/MessageBoard');
const RECENTLY_OPENED_MAX_COUNT = 5;
const RECENTLY_OPENED_STORAGE_KEY = 'recentlyOpened';

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

    static async exportAsCsv() {
        if(!Commands._checkShapefileAvailable()) return;

        const saveFilePath = dialog.showSaveDialog({ defaultPath: `*/${path.basename(G.mapState.shapefile.filePath).replace(/\.shp/, '.csv')}`, filters: [{ name: 'Csv (*.csv)', extensions: ['csv'] }] });
        if(saveFilePath) {
            const fields = _.clone(G.mapState.fields);
            fields.push('geom');

            const baseLayer = await LeafletEx.getBaseLayer(G.map);
            const features = baseLayer.getLayers().map(l =>  _.omit(l.feature, 'done')).map(f => { 
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
            const baseLayer = await LeafletEx.getBaseLayer(G.map);
            const features = baseLayer.getLayers().map(l =>  _.omit(l.feature, 'done'));
            const featureCollection = { type: 'FeatureCollection', features: features };
            const jsonContent = JSON.stringify(featureCollection, null, 2);
            fs.writeFileSync(saveFilePath, jsonContent, { encoding: 'utf8' });
            AlertEx.alert('GeoJson file exporting completed.', AlertLevels.success);
        }
    }

    static async openShapefile(filePath = undefined) {
        if (!_.isString(filePath) || _.isUndefined(filePath)) {
            filePath = dialog.showOpenDialog({ properties: ['openFile'], filters: extensionFilter });
            if(_.isUndefined(filePath) || filePath.length === 0) {
                console.log('cancel selection.');
                return;
            }
            else {
                filePath = filePath[0];
            }
        }
        
        G.mapState = { };
        G.mapState.shapefile = new Shapefile(filePath);
        await Commands._initView(G.mapState.shapefile);
        Commands._recordRecentlyOpened(filePath);
    }

    static _recordRecentlyOpened(filePath) {
        let recentlyOpened = undefined;
        let recentlyOpenedContent = localStorage.getItem('recentlyOpened');
        if (_.isUndefined(recentlyOpenedContent)) {
            recentlyOpened = [];
        } else {
            recentlyOpened = JSON.parse(recentlyOpenedContent);
        }

        const removeIndex = recentlyOpened.indexOf(filePath);
        if (removeIndex !== -1) {
            recentlyOpened.splice(removeIndex, 1);
        }
        recentlyOpened.unshift(filePath);
        while (recentlyOpened.length > RECENTLY_OPENED_MAX_COUNT) {
            recentlyOpened.pop();
        }

        localStorage.setItem(RECENTLY_OPENED_STORAGE_KEY, JSON.stringify(recentlyOpened));
        Commands._updateRecentlyOpened(recentlyOpened);
    }

    static _syncRecentlyOpened() {
        let recentlyOpened = undefined;
        const recentlyOpenedContent = localStorage.getItem('recentlyOpened');
        if (!_.isUndefined(recentlyOpenedContent)) {
            recentlyOpened = JSON.parse(recentlyOpenedContent);
        } else {
            return;
        }

        Commands._updateRecentlyOpened(recentlyOpened);
    }

    static async _initView(shapefile) {
        await shapefile.openWith(async () => {
            const data = [];
            const iterator = await shapefile.iterator();
            const total = await shapefile.count();
            const envelope = shapefile.envelope();
            const fields = shapefile.fields();
            const columns = fields.map(f => { return { field: f, title: f }; });
            
            G.progress.show();
            const features = [];
            let record = undefined, current = 0;
            while ((record = await iterator.next()) && !record.done) {
                data.push(record.properties);
                features.push(record);
                current++;
                G.progress.value(current * 100 / total);
            };
            G.progress.reset();
            
            const options = { columns, data, pagination: true, paginationVAlign: 'top' };
            G.table.bootstrapTable('destroy').bootstrapTable(options).on('click-row.bs.table', TableEx.rowSelected);
            
            const bounds = LeafletEx.envelopeToBounds(envelope);
            const featureCollection = { type: 'FeatureCollection', features };
            LeafletEx.loadBase(G.map, featureCollection).fitBounds(bounds);
            G.mapState = _.merge(G.mapState, { fields, total, envelope, columns, featureCollection });
        });
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

    static _updateRecentlyOpened(recentlyOpened) {
        if(!_.isArray(recentlyOpened)) return;

        const appMenu = Menu.getApplicationMenu();
        const recentOpenedMenuItem = appMenu.getMenuItemById('mi_open_recently');
        recentOpenedMenuItem.submenu.clear();
        recentlyOpened.forEach(i => {
            let filePath = i;
            const menuItem = new MenuItem({ label: Commands._shortenPath(filePath), click: function(f) {
                return async () => await Commands.openShapefile(f);
            }(filePath) });
            recentOpenedMenuItem.submenu.append(menuItem);
        });

        Menu.setApplicationMenu(appMenu);
    }

    static _shortenPath(filePath) {
        const home = os.homedir();
        return filePath.replace(home, '~');
    }
}