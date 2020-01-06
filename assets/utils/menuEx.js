const os = require('os');
const { Menu, MenuItem } = require('electron').remote;
const LocalStorageEx = require('./localStorageEx');
const menuTemplate = require('../menus');

module.exports = class MenuEx {
    static init() {
        const menu = Menu.buildFromTemplate(menuTemplate);
        Menu.setApplicationMenu(menu);

        let recentlyOpened = LocalStorageEx.getRecentlyOpened();
        MenuEx.updateRecentlyOpened(recentlyOpened);

        let baseMapOn = LocalStorageEx.getBaseMapOn();
        MenuEx.setBaseMapOn(baseMapOn);
        
        if (baseMapOn) {
            require('./leafletEx').loadBaseLayer(G.map);
        }
    }

    static updateRecentlyOpened(recentlyOpened) {
        if(!_.isArray(recentlyOpened)) return;
        
        const Commands = require('../commands');
        const appMenu = Menu.getApplicationMenu();
        const recentOpenedMenuItem = appMenu.getMenuItemById('mi_open_recently');
        recentOpenedMenuItem.submenu.clear();

        recentlyOpened.forEach(i => {
            let filePath = i;
            const shorterName = MenuEx._shortenPath(filePath);
            const menuItem = new MenuItem({ label: shorterName, click: function(f) {
                return () => Commands.openShapefile(f);
            }(filePath) });

            recentOpenedMenuItem.submenu.append(menuItem);
        });

        Menu.setApplicationMenu(appMenu);
    }

    static setBaseMapOn(baseMapOn) {
        const appMenu = Menu.getApplicationMenu();
        const baseMapOnMenuItem = appMenu.getMenuItemById('mi_map_osm');
        baseMapOnMenuItem.checked = baseMapOn;

        Menu.setApplicationMenu(appMenu);
    }
    
    static _shortenPath(filePath) {
        const home = os.homedir();
        return filePath.replace(home, '~');
    }
}