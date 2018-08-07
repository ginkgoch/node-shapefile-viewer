const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const { dialog } = require('electron').remote;
const { Shapefile } = require('ginkgoch-shapefile-reader');
const TableEx = require('./tableEx');
const LeafletEx = require('./leafletEx');
const extensionFilter = [ { name: 'Shapefiles (*.shp)', extensions: [ 'shp' ] } ];

module.exports = class Commands {
    static async exportAsGeoJson() {
        if (!G.mapState || !G.mapState.shapefile) {
            dialog.showErrorBox('Shapefile is not loaded', `Please open a shapefile first.`);
            return;
        }

        const saveFilePath = dialog.showSaveDialog({ defaultPath: `*/${path.basename(G.mapState.shapefile.filePath).replace(/\.shp/, '.json')}`, filters: [{ name: 'GeoJSON (*.json)', extensions: ['json'] }] });
        if(saveFilePath) {
            const baseLayer = await LeafletEx.getBaseLayer(G.map);
            const features = baseLayer.getLayers().map(l =>  _.omit(l.feature, 'done'));
            const featureCollection = { type: 'FeatureCollection', features: features };
            const jsonContent = JSON.stringify(featureCollection, null, 2);
            fs.writeFileSync(saveFilePath, jsonContent, { encoding: 'utf8' });
        }
    }

    static async openShapefile() {
        const filePath = dialog.showOpenDialog({ properties: ['openFile'], filters: extensionFilter });
        if(_.isUndefined(filePath)) {
            console.log('cancel selection.');
            return;
        }
        
        G.mapState = { };
        G.mapState.shapefile = new Shapefile(filePath[0]);
        await Commands._initView(G.mapState.shapefile);
    }

    static async _initView(shapefile) {
        await shapefile.openWith(async () => {
            const data = [];
            const iterator = await shapefile.iterator();
            const total = await shapefile.count();
            const envelope = shapefile.envelope();
            const columns = shapefile.fields().map(f => { return { field: f, title: f }; });
            
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
            G.mapState = _.merge(G.mapState, { total, envelope, columns, featureCollection });
        });
    }
}