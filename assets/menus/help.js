const commands = require('../commands');

module.exports = {
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
            label: 'Twitter',
            click: commands.gotoUri('twitter')
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
        { type: 'separator' },
        {
            role: 'toggledevtools'
        }
    ]
};