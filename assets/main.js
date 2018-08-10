const { Menu } = require('electron').remote;
const ToolboxEx = require('./utils/toolboxEx');
const Progress = require('./utils/progress');
const Commands = require('./commands');

const G = { };
$(async () => {
    createMenu();

    G.map = L.map('map', { preferCanvas: true });
    G.popup = L.popup();
    G.table = $('.table-field-data');
    G.progress = new Progress($('.progress'));
    G.progress.reset();
    G.alert = $('.alert').hide();
    
    ToolboxEx.init();
    Commands._syncRecentlyOpened();
});

const menuTemplate = require('./menus');
function createMenu() {
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}
