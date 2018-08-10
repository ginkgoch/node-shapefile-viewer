const os = require('os');
const { Menu, MenuItem } = require('electron').remote;
const LocalStorageEx = require('./localStorageEx');
const RECENTLY_OPENED_MAX_COUNT = 5;

module.exports = class RecentlyFileEx {
    static init() {
        let recentlyOpened = LocalStorageEx.getRecentlyOpened();
        RecentlyFileEx.updateRecentlyOpened(recentlyOpened);
    }
    
    static updateRecentlyOpened(recentlyOpened) {
        if(!_.isArray(recentlyOpened)) return;
        
        const Commands = require('../commands');
        const appMenu = Menu.getApplicationMenu();
        const recentOpenedMenuItem = appMenu.getMenuItemById('mi_open_recently');
        recentOpenedMenuItem.submenu.clear();

        recentlyOpened.forEach(i => {
            let filePath = i;
            const shorterName = RecentlyFileEx._shortenPath(filePath);
            const menuItem = new MenuItem({ label: shorterName, click: function(f) {
                return async () => await Commands.openShapefile(f);
            }(filePath) });
            recentOpenedMenuItem.submenu.append(menuItem);
        });

        Menu.setApplicationMenu(appMenu);
    }

    static recordRecentlyOpened(filePath) {
        const recentlyOpened = LocalStorageEx.getRecentlyOpened();
        const removeIndex = recentlyOpened.indexOf(filePath);
        if (removeIndex !== -1) {
            recentlyOpened.splice(removeIndex, 1);
        }
        recentlyOpened.unshift(filePath);
        while (recentlyOpened.length > RECENTLY_OPENED_MAX_COUNT) {
            recentlyOpened.pop();
        }

        LocalStorageEx.setRecentlyOpened(recentlyOpened);
        RecentlyFileEx.updateRecentlyOpened(recentlyOpened);
    }

    static _shortenPath(filePath) {
        const home = os.homedir();
        return filePath.replace(home, '~');
    }
}
