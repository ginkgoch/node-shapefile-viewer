const { app } = require('electron').remote;

module.exports = [{
        label: app.getName(),
        submenu: [{
                label: 'Open',
                click: require('../utils/commands').openShapefile
            },
            {
                type: 'separator'
            },
            {
                role: 'about'
            },
            {
                type: 'separator'
            },
            {
                role: 'hide'
            },
            {
                role: 'hideothers'
            },
            {
                role: 'unhide'
            },
            {
                type: 'separator'
            },
            {
                role: 'quit'
            }
        ]
    },
    {
        label: 'File',
        submenu: [{
                label: 'Open',
                click: require('../utils/commands').openShapefile
            },
            {
                label: 'Export To',
                submenu: [{
                    label: 'GeoJson',
                    click: require('../utils/commands').exportAsGeoJson
                }]
            },
        ]
    },
    {
        label: 'Map',
        submenu: [{
                label: 'Zoom Default'
            },
            {
                label: 'Zoom In'
            },
            {
                label: 'Zoom Out'
            },
            {
                type: 'separator'
            },
            {
                label: 'Clear Highlights'
            }
        ]
    },
    {
        label: 'View',
        submenu: [{
                role: 'reload'
            },
            {
                role: 'forcereload'
            },
            {
                role: 'toggledevtools'
            },
            {
                type: 'separator'
            },
            {
                role: 'togglefullscreen'
            }
        ]
    },
];

// let template = [
//     {
//       label: 'Edit',
//       submenu: [
//         {role: 'undo'},
//         {role: 'redo'},
//         {type: 'separator'},
//         {role: 'cut'},
//         {role: 'copy'},
//         {role: 'paste'},
//         {role: 'pasteandmatchstyle'},
//         {role: 'delete'},
//         {role: 'selectall'}
//       ]
//     },
//     {
//       label: 'View',
//       submenu: [
//         {role: 'reload'},
//         {role: 'forcereload'},
//         {role: 'toggledevtools'},
//         {type: 'separator'},
//         {role: 'resetzoom'},
//         {role: 'zoomin'},
//         {role: 'zoomout'},
//         {type: 'separator'},
//         {role: 'togglefullscreen'}
//       ]
//     },
//     {
//       role: 'window',
//       submenu: [
//         {role: 'minimize'},
//         {role: 'close'}
//       ]
//     },
//     {
//       role: 'help',
//       submenu: [
//         {
//           label: 'Learn More',
//           click () { require('electron').shell.openExternal('https://electronjs.org') }
//         }
//       ]
//     }
// ]

// if (process.platform === 'darwin') {
//     template.unshift({
//         label: require('electron').remote.app.getName(),
//         submenu: [
//         {role: 'about'},
//         {type: 'separator'},
//         {role: 'services', submenu: []},
//         {type: 'separator'},
//         {role: 'hide'},
//         {role: 'hideothers'},
//         {role: 'unhide'},
//         {type: 'separator'},
//         {role: 'quit'}
//         ]
//     })

//     // Edit menu
//     template[1].submenu.push(
//         {type: 'separator'},
//         {
//         label: 'Speech',
//         submenu: [
//             {role: 'startspeaking'},
//             {role: 'stopspeaking'}
//         ]
//         }
//     )

//     // Window menu
//     template[3].submenu = [
//         {role: 'close'},
//         {role: 'minimize'},
//         {role: 'zoom'},
//         {type: 'separator'},
//         {role: 'front'}
//     ]
// }

// module.exports = template;