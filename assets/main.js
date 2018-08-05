const { dialog } = require('electron').remote;
const _ = require('lodash');
const { Shapefile } = require('ginkgoch-shapefile-reader');
const Progress = require('./utils/progress');
const extensionFilter = [ { name: 'Shapefiles (*.shp)', extensions: [ 'shp' ] } ];
const style = { color: '#000000', fillColor: '#ff0000', weight: 3 };

const G = { };
$(async () => {
    const map = L.map('map', { preferCanvas: true });
    G.progress = new Progress($('.progress'));
    G.progress.reset();

    $('.btn-choose-file').click(async e => {
        filePath = dialog.showOpenDialog({properties: ['openFile'], filters: extensionFilter });
        
        if(_.isUndefined(filePath)) console.log('cancel selection.');
        
        const shapefile = new Shapefile(filePath[0]);
        if (shapefile) {
            await loadFieldData(map, shapefile);
        }
    });
});

async function loadFieldData(map, shapefile) {
    await shapefile.openWith(async () => {
        const columns = shapefile.fields().map(f => { return { field: f, title: f }; });
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

        const featureCollection = { type: 'FeatureCollection', features };
        const fieldData = { columns, data };
        $('.table-field-data').bootstrapTable('destroy').bootstrapTable(fieldData);
        loadMap(map, featureCollection).fitBounds(envelopeToBounds(envelope));
    });
}

function loadMap(map, featureCollection) {
    clearLayers(map);
    L.geoJSON(featureCollection, { style: f => style }).addTo(map);
    return map;
}

function envelopeToBounds(envelope) {
    return [ [ envelope.miny, envelope.minx ], [ envelope.maxy, envelope.maxx ] ];
}

function clearLayers(map) {
    getLayers(map).forEach(l => l.remove());
}

function getLayers(map) {
    const layers = [];
    map.eachLayer(l => layers.push(l));
    return layers;
}
