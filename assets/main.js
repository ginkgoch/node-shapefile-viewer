const { dialog } = require('electron').remote;
const _ = require('lodash');
const { Shapefile } = require('ginkgoch-shapefile-reader');

async function loadFieldData(shapefile) {
    await shapefile.openWith(async () => {
        const columns = shapefile.fields().map(f => { return { field: f, title: f }; });
        const data = [];
        const iterator = await shapefile.iterator();
        const total = await shapefile.count();
        
        $('.progress').show();
        let record = undefined, current = 0;
        while ((record = await iterator.next()) && !record.done) {
            data.push(record.properties);
            current++;
            let valeur = current * 100 / total;
            setProgress(valeur);
        };

        const fieldData = { columns, data };
        $('.table-field-data').bootstrapTable('destroy').bootstrapTable(fieldData);
        $('.progress').hide();
        setProgress(0);
    });
}

$(async () => {
    $('.progress').hide();
    $('.btn-choose-file').click(async e => {
        filePath = dialog.showOpenDialog({properties: ['openFile'], 
            filters: [ { name: 'Shapefiles (*.shp)', extensions: [ 'shp' ] } ]
        });
        
        if(_.isUndefined(filePath)) console.log('cancel selection.');

        const shapefile = new Shapefile(filePath[0]);
        if (shapefile) {
            await loadFieldData(shapefile);
        }
    });
});

function setProgress(valeur) {
    $('.progress-bar').css('width', valeur+'%').attr('aria-valuenow', valeur);
}
