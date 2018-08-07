const { app } = require('electron').remote;
const commands = require('../utils/commands');

module.exports = [{
        label: app.getName(),
        submenu: [
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
                label: 'Open Shp',
                accelerator: 'CmdOrCtrl+O',
                click: require('../utils/commands').openShapefile
            },
            {
                label: 'Export To',
                submenu: [{
                    label: 'GeoJson',
                    click: require('../utils/commands').exportAsGeoJson
                }, 
                {
                    label: 'Csv',
                    click: require('../utils/commands').exportAsCsv
                }]
            },
        ]
    },
    {
        label: 'Map',
        submenu: [{
                label: 'Zoom Default',
                accelerator: 'CmdOrCtrl+0',
                click: require('../utils/commands').zoomToBounds
            },
            {
                label: 'Zoom In',
                accelerator: 'CmdOrCtrl+Up',
                click: require('../utils/commands').zoomIn
            },
            {
                label: 'Zoom Out',
                accelerator: 'CmdOrCtrl+Down',
                click: require('../utils/commands').zoomOut
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
                type: 'separator'
            },
            {
                role: 'togglefullscreen'
            }
        ]
    },
    {
        role: 'help',
        submenu: [{
                label: 'Repository',
                click: commands.gotoUri('repo')
            },
            {
                label: 'Issues',
                click: commands.gotoUri('issues')
            },
            {
                label: 'Wiki',
                click: commands.gotoUri('wiki')
            },
            {
                type: 'separator'
            },
            {
                label: 'Releases',
                click: commands.gotoUri('releases')
            },
            {
                label: 'Documentation',
                click: commands.gotoUri('doc')
            },
            {
                type: 'separator'
            },
            {
                role: 'toggledevtools'
            }
        ]
    }
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