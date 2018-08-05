const style = { color: '#000000', fillColor: '#ff0000', weight: 3 };

module.exports = {
    clearLayers : function(map) {
        const layers = [];
        map.eachLayer(l => layers.push(l));
        layers.forEach(l => l.remove());
    },

    envelopeToBounds : function(envelope) {
        return [ [ envelope.miny, envelope.minx ], [ envelope.maxy, envelope.maxx ] ];
    },

    loadFeatures : function(map, featureCollection) {
        this.clearLayers(map);
        L.geoJSON(featureCollection, { style: f => style }).addTo(map);
        return G.map;
    }
};