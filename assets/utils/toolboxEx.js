const Commands = require('../commands');

module.exports = class ToolboxEx {
    static init() {
        $('.btn-choose-file').click(Commands.openShapefile);
        $('.btn-export-json').click(Commands.exportAsGeoJson);
        $('.btn-export-csv').click(Commands.exportAsCsv);
        $('.btn-zoom-default').click(Commands.zoomToBounds);
        $('.btn-zoom-in').click(Commands.zoomIn);
        $('.btn-zoom-out').click(Commands.zoomOut);
        $('.btn-highlight-clear').click(Commands.clearHighlights);
    }
}