const StyleEx = require('./styleEx');
const LeafletEx = require('./leafletEx');

module.exports = class ModalEx {
    static init() {
        ModalEx.initStyleModal();
    }

    static initStyleModal() {
        $('.btn-style-save').click(async e => {
            const styleContent = $('#styleTextareaContent').val();
            const style = JSON.parse(styleContent); 
            StyleEx.setStyles(style);

            const basicOption = StyleEx.basic();
            const basicLayer = await LeafletEx.getJsonLayer(G.map);
            basicLayer && basicLayer.eachLayer(l => l.setStyle(basicOption));

            const highlightOption = StyleEx.highlight();
            const highlightLayer = await LeafletEx.getHighlightLayer(G.map);
            highlightLayer && highlightLayer.setStyle(highlightOption);

            $('#styleModalCenter').modal('hide');
        });
        $('#styleModalCenter').on('show.bs.modal', () => {
            $('#styleTextareaContent').val(JSON.stringify(StyleEx.getStyles(), null, 2));
        });
    }
}