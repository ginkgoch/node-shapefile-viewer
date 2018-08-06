const { dialog } = require('electron').remote;
const _ = require('lodash');
const { Shapefile } = require('ginkgoch-shapefile-reader');
const Progress = require('./utils/progress');
const LeafletEx = require('./utils/leafletEx');
const TableEx = require('./utils/tableEx');
const extensionFilter = [ { name: 'Shapefiles (*.shp)', extensions: [ 'shp' ] } ];

const G = { };
$(async () => {
    G.map = L.map('map', { preferCanvas: true });
    G.popup = L.popup();
    G.table = $('.table-field-data');
    G.progress = new Progress($('.progress'));
    G.progress.reset();

    $('.btn-choose-file').click(async e => {
        filePath = dialog.showOpenDialog({properties: ['openFile'], filters: extensionFilter });
        if(_.isUndefined(filePath)) {
            console.log('cancel selection.');
            return;
        }
        
        G.mapState = { };
        G.mapState.shapefile = new Shapefile(filePath[0]);
        await initView(G.mapState.shapefile);
    });
});

async function initView(shapefile) {
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
