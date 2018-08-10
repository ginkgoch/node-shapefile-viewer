const LocalStorageEx = require('./localStorageEx');
const RECENTLY_OPENED_MAX_COUNT = 5;

module.exports = class RecentlyFileEx {
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
        require('./menuEx').updateRecentlyOpened(recentlyOpened);
    }
}
