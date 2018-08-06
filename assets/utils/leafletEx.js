const style = { color: '#000000', fillColor: '#ff0000', weight: 3 };
const highlightStyle = { color: 'yellow', fillColor: 'yellow', weight: 3 };
const BASE_LAYER_NAME = 'base layer';
const HIGHLIGHT_LAYER_NAME = 'highlight layer';

module.exports = {
    removeLayers : function(map, filter) {
        map.eachLayer(l => {
            if (filter && filter(l)) {
                l.remove();
            }
        });
    },

    envelopeToBounds : function(envelope) {
        return [ [ envelope.miny, envelope.minx ], [ envelope.maxy, envelope.maxx ] ];
    },

    loadBase : function(map, featureCollection) {
        this.removeLayers(map, l => l.name === BASE_LAYER_NAME || l.name === HIGHLIGHT_LAYER_NAME);
        const layer = L.geoJSON(featureCollection, { style }).addTo(map);
        layer.name = BASE_LAYER_NAME;
        return G.map;
    },

    loadHighlight : function(map, feature) {
        this.removeLayers(map, l => l.name === HIGHLIGHT_LAYER_NAME);           
        const layer = L.geoJSON(feature, { style: highlightStyle }).addTo(map);
        layer.name = HIGHLIGHT_LAYER_NAME;
    }
};