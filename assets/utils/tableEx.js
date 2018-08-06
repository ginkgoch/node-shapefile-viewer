const LeafletEx = require('./leafletEx');

module.exports = {
    rowSelected: function() {
        const recordId = arguments[2].data('index');
        const selectedFeature = G.mapState.featureCollection.features[recordId];
        LeafletEx.loadHighlight(G.map, selectedFeature);
    }
};