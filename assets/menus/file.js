const commands = require('../commands');

module.exports = {
    label: 'File',
    submenu: [{
            label: 'Open Shp',
            accelerator: 'CmdOrCtrl+O',
            click: commands.openShapefile
        },
        {
            label: 'Export To',
            submenu: [{
                label: 'GeoJson',
                click: commands.exportAsGeoJson
            }, 
            {
                label: 'Csv',
                click: commands.exportAsCsv
            }]
        },
    ]
};