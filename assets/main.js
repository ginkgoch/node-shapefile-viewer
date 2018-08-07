const _ = require('lodash');
const { Menu } = require('electron').remote;

const Progress = require('./utils/progress');
const Commands = require('./utils/commands');

const G = { };
$(async () => {
    createMenu();

    G.map = L.map('map', { preferCanvas: true });
    G.popup = L.popup();
    G.table = $('.table-field-data');
    G.progress = new Progress($('.progress'));
    G.progress.reset();

    $('.btn-choose-file').click(async e => {
        await Commands.openShapefile();
    });
});

const menuTemplate = require('./menus/template');
function createMenu() {
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}
