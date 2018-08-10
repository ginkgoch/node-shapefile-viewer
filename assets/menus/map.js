const commands = require('../commands');

module.exports = {
    label: 'Map',
    submenu: [{
            label: 'Zoom Default',
            accelerator: 'CmdOrCtrl+0',
            click: commands.zoomToBounds
        },
        {
            label: 'Zoom In',
            accelerator: 'CmdOrCtrl+Up',
            click: commands.zoomIn
        },
        {
            label: 'Zoom Out',
            accelerator: 'CmdOrCtrl+Down',
            click: commands.zoomOut
        },
        {
            type: 'separator'
        },
        {
            type: 'radio',
            label: 'Open street map',
            checked: true,
            click: commands.toggleBaseMap
        },
        {
            type: 'separator'
        },
        {
            label: 'Clear Highlights',
            accelerator: 'CmdOrCtrl+D',
            click: commands.clearHighlights
        }
    ]
};