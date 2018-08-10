const circleMarkerOptionsBase = { radius: 8, fillColor: '#ff7800', color: '#000', weight: 2, opacity: 1, fillOpacity: 0.8 };
const circleMarkerOptionsHighlight = _.merge(_.clone(circleMarkerOptionsBase), { fillColor: '#ff0000', color: '#000', weight: 3 });
const circleMarker = (latlng, options) => L.circleMarker(latlng, options);
const optionsBase = { color: '#000000', fillColor: '#ff0000', weight: 3, pointToLayer: (f, latlng) => circleMarker(latlng, circleMarkerOptionsBase) };
const optionsHighlight = { color: 'yellow', fillColor: 'yellow', weight: 3, pointToLayer: (f, latlng) => circleMarker(latlng, circleMarkerOptionsHighlight) };

const VECTOR_LAYER_NAME = 'vector layer';
const HIGHLIGHT_LAYER_NAME = 'highlight layer';
const BASE_MAP_NAME = 'base map';

module.exports = {
    removeLayers : function(map, layerNames) {
        map.eachLayer(l => {
            if (_.includes(layerNames, l.name)) {
                l.closePopup();
                l.unbindPopup();
                l.remove();
            }
        });
    },

    removeHighlights: function(map) {
        this.removeLayers(map, [ HIGHLIGHT_LAYER_NAME ]);
    },

    envelopeToBounds : function(envelope) {
        return [ [ envelope.miny, envelope.minx ], [ envelope.maxy, envelope.maxx ] ];
    },

    loadJsonLayer : function(map, featureCollection) {
        this.removeLayers(map, [ VECTOR_LAYER_NAME, HIGHLIGHT_LAYER_NAME ]);
        const layer = L.geoJSON(featureCollection, optionsBase).on('click', e => {
            this.loadHighlight(map, e.layer.feature);
            e.originalEvent.stopPropagation();
        }).addTo(map);
        layer.name = VECTOR_LAYER_NAME;
        return G.map;
    },

    loadBaseLayer : function(map) {
        L.tileLayer.provider('OpenStreetMap').addTo(map).id = BASE_MAP_NAME;
    },

    removeBaseLayer: function(map) {
        this.removeLayers(map, [ BASE_MAP_NAME ]);
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
    },

    getLayerByName: async function(map, layerName) {
        return await new Promise((resolve, reject) => {
            map.eachLayer(l => {
                if (l.name === layerName) {
                    resolve(l);
                }
            });

            reject(`Layer<${layerName}> not found.`);
        });
    },

    getBaseLayer: async function(map) {
        return await this.getLayerByName(map, VECTOR_LAYER_NAME);
    }
};