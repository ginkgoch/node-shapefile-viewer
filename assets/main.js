const { Menu } = require('electron').remote;
const ToolboxEx = require('./utils/toolboxEx');
const Progress = require('./utils/progress');
const LeafletEx = require('./utils/leafletEx');
const RecentlyFileEx = require('./utils/recentlyFileEx');

const G = { };
$(async () => {
    createMenu();

    G.map = L.map('map', { preferCanvas: true });
    LeafletEx.loadBaseLayer(G.map);
    G.map.setView([0, 0], 2);
    G.popup = L.popup();
    G.table = $('.table-field-data');
    G.progress = new Progress($('.progress'));
    G.progress.reset();
    G.alert = $('.alert').hide();
    
    ToolboxEx.init();
    RecentlyFileEx.init();
});

const menuTemplate = require('./menus');
function createMenu() {
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}
