const _ = require('lodash');
const circleMarkerOptionsBase = { radius: 8, fillColor: '#ff7800', color: '#000', weight: 2, opacity: 1, fillOpacity: 0.8 };
const circleMarkerOptionsHighlight = _.merge(_.clone(circleMarkerOptionsBase), { fillColor: '#ff0000', color: '#000', weight: 3 });
const circleMarker = (latlng, options) => L.circleMarker(latlng, options);
const optionsBase = { color: '#000000', fillColor: '#ff0000', weight: 3, pointToLayer: (f, latlng) => circleMarker(latlng, circleMarkerOptionsBase) };
const optionsHighlight = { color: 'yellow', fillColor: 'yellow', weight: 3, pointToLayer: (f, latlng) => circleMarker(latlng, circleMarkerOptionsHighlight) };

const BASE_LAYER_NAME = 'base layer';
const HIGHLIGHT_LAYER_NAME = 'highlight layer';

module.exports = {
    removeLayers : function(map, layerNames) {
        map.eachLayer(l => {
            if (_.includes(layerNames, l.name)) {
                l.unbindPopup();
                l.remove();
            }
        });
    },

    envelopeToBounds : function(envelope) {
        return [ [ envelope.miny, envelope.minx ], [ envelope.maxy, envelope.maxx ] ];
    },

    loadBase : function(map, featureCollection) {
        this.removeLayers(map, l => [ BASE_LAYER_NAME, HIGHLIGHT_LAYER_NAME ]);
        const layer = L.geoJSON(featureCollection, optionsBase).on('click', e => {
            this.loadHighlight(map, e.layer.feature);
            e.originalEvent.stopPropagation();
        }).addTo(map);
        layer.name = BASE_LAYER_NAME;
        return G.map;
    },

    loadHighlight : function(map, feature) {
        this.removeLayers(map, [ HIGHLIGHT_LAYER_NAME ]);           
        const layer = L.geoJSON(feature, _.merge(optionsHighlight, { interactive: false })).addTo(map).bindPopup(G.popup, { maxHeight: 200 });
        layer.name = HIGHLIGHT_LAYER_NAME;
        const latlng = layer.getBounds().getCenter();

        const html = this.propertiesToTable(feature.properties);
        layer.setPopupContent(html[0]);
        layer.openPopup(latlng);
    },

    propertiesToTable: function(properties) {
        const columns = [{ field: 'KEY', title: 'KEY' }, { field: 'VALUE', title: 'VALUE' }];
        const data = [];
        _.forOwn(properties, (v, k) => {
            data.push({ KEY: k, VALUE: v });
        });

        return $('<table />').bootstrapTable({ columns, data });
    }
};