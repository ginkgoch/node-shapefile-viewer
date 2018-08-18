const circleMarkerOptionsBase = { radius: 8, fillColor: '#ff7800', color: '#585b60', weight: 1, opacity: 1, fillOpacity: 0.8 };
const circleMarkerOptionsHighlight = _.merge(_.clone(circleMarkerOptionsBase), { fillColor: '#ff0000', color: '#000', weight: 2 });
const circleMarker = (latlng, options) => L.circleMarker(latlng, options);
const optionsBase = { color: '#585b60', fillColor: '#ff0000', weight: 1, pointToLayer: (f, latlng) => circleMarker(latlng, circleMarkerOptionsBase) };
const optionsHighlight = { color: 'yellow', fillColor: 'yellow', weight: 2, pointToLayer: (f, latlng) => circleMarker(latlng, circleMarkerOptionsHighlight) };

module.exports = {
    defaultStyles: { 
        basic: optionsBase,
        basicMarker: circleMarkerOptionsBase,
        highlight: optionsHighlight,
        highlightMarker: circleMarkerOptionsHighlight
    },
    basic: function() {
        const styleOption = this._getStyleOption('basic', 'basicMarker');
        return styleOption;
    },
    highlight: function() {
        const styleOption = this._getStyleOption('highlight', 'highlightMarker', false);
        return styleOption;
    },
    getStyles: function() {
        let styles = this.defaultStyles;
        let stylesContent = localStorage.getItem('STYLE');
        if (stylesContent) {
            styles = JSON.parse(stylesContent);
        }
        return styles;
    },
    setStyles: function(style) {
        localStorage.setItem('STYLE', JSON.stringify(style));
    },
    _getStyleOption: function(basicStyleKey, markerStyleKey, interactive = true) {
        const markerStyle = this._getStyle(markerStyleKey);
        let style = this._getStyle(basicStyleKey);
        style = _.assign(style, { interactive, pointToLayer: (_f, latlng) => this._createMarker(latlng, markerStyle) });
        return style;
    },
    _getStyle: function(key) {
        let styles = this.getStyles();
        return _.clone(styles[key]);
    },
    _createMarker: function(latlng, options) {
        return L.circleMarker(latlng, options);
    }
}
