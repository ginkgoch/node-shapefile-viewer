const { dialog } = require('electron').remote;
const _ = require('lodash');
const { Shapefile } = require('ginkgoch-shapefile-reader');
const Progress = require('./utils/progress');
const LeafletEx = require('./utils/leafletEx');
const extensionFilter = [ { name: 'Shapefiles (*.shp)', extensions: [ 'shp' ] } ];

const G = { };
$(async () => {
    G.map = L.map('map', { preferCanvas: true });
    G.table = $('.table-field-data');
    G.progress = new Progress($('.progress'));
    G.progress.reset();

    $('.btn-choose-file').click(async e => {
        filePath = dialog.showOpenDialog({properties: ['openFile'], filters: extensionFilter });
        
        if(_.isUndefined(filePath)) console.log('cancel selection.');
        
        const shapefile = new Shapefile(filePath[0]);
        await loadFieldData(shapefile);
    });
});

async function loadFieldData(shapefile) {
    await shapefile.openWith(async () => {
        const data = [];
        const iterator = await shapefile.iterator();
        const total = await shapefile.count();
        const envelope = shapefile.envelope();
        
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
        
        const columns = shapefile.fields().map(f => { return { field: f, title: f }; });
        const fieldData = { columns, data };
        G.table.bootstrapTable('destroy').bootstrapTable(fieldData);

        const bounds = LeafletEx.envelopeToBounds(envelope);
        const featureCollection = { type: 'FeatureCollection', features };
        LeafletEx.loadFeatures(G.map, featureCollection).fitBounds(bounds);
    });
}
