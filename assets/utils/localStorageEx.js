const RECENTLY_OPENED_STORAGE_KEY = 'recentlyOpened';
const MENU_STATS_STORAGE_KEY = 'menuStats';

module.exports = class LocalStorageEx {
    static getRecentlyOpened() {
        let recentlyOpenedContent = localStorage.getItem(RECENTLY_OPENED_STORAGE_KEY);
        if (_.isUndefined(recentlyOpenedContent)) return [];
        else return JSON.parse(recentlyOpenedContent);
    }

    static setRecentlyOpened(recentlyOpened) {
        localStorage.setItem(RECENTLY_OPENED_STORAGE_KEY, JSON.stringify(recentlyOpened));
    }

    static getMenuStats() {
        let menuStats = localStorage.getItem(MENU_STATS_STORAGE_KEY);
        if (!menuStats) {
            menuStats = { };
        } else {
            menuStats = JSON.parse(menuStats);
        }
    }

    static setMenuStats(menuStats) {
        localStorage.setItem(MENU_STATS_STORAGE_KEY, JSON.stringify(menuStats));
    }
}