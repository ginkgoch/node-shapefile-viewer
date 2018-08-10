const MenuEx = require('./utils/menuEx');
const ToolboxEx = require('./utils/toolboxEx');
const Progress = require('./utils/progress');

const G = { };
$(async () => {
    G.map = L.map('map', { preferCanvas: true });
    G.map.setView([0, 0], 2);
    G.popup = L.popup();
    G.table = $('.table-field-data');
    G.progress = new Progress($('.progress'));
    G.progress.reset();
    G.alert = $('.alert').hide();
    
    MenuEx.init();
    ToolboxEx.init();
});


