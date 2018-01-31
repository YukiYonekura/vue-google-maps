'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _clone2 = require('lodash/clone');

var _clone3 = _interopRequireDefault(_clone2);

var _eventsBinder = require('../utils/eventsBinder.js');

var _eventsBinder2 = _interopRequireDefault(_eventsBinder);

var _propsBinder = require('../utils/propsBinder.js');

var _propsBinder2 = _interopRequireDefault(_propsBinder);

var _mapElementMixin = require('./mapElementMixin');

var _mapElementMixin2 = _interopRequireDefault(_mapElementMixin);

var _getPropsValuesMixin = require('../utils/getPropsValuesMixin.js');

var _getPropsValuesMixin2 = _interopRequireDefault(_getPropsValuesMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import MarkerClusterer from 'marker-clusterer-plus';

/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

/**
  * @class Cluster
  * @prop $clusterObject -- Exposes the marker clusterer to
        descendent Marker classes. Override this if you area
        extending the class
**/

var props = {
  maxZoom: {
    type: Number,
    twoWay: false
  },
  calculator: {
    type: Function,
    twoWay: false
  },
  gridSize: {
    type: Number,
    twoWay: false
  },
  styles: {
    type: Array,
    twoWay: false
  },
  spiderOption: {
    type: Object
  }
};

var events = ['click', 'rightclick', 'dblclick', 'drag', 'dragstart', 'dragend', 'mouseup', 'mousedown', 'mouseover', 'mouseout'];

exports.default = {
  mixins: [_mapElementMixin2.default, _getPropsValuesMixin2.default],
  props: props,

  render: function render(h) {
    // <div><slot></slot></div>
    return h('div', this.$slots.default);
  },
  deferredReady: function deferredReady() {
    var _this = this;

    var options = (0, _clone3.default)(this.getPropsValues());

    if (typeof OverlappingMarkerSpiderfier === 'undefined') {
      /* eslint-disable no-console */
      console.error('OverlappingMarkerSpiderfier is not installed! require() it or include it from https://cdnjs.cloudflare.com/ajax/libs/OverlappingMarkerSpiderfier/1.0.3/oms.min.js');
      throw new Error('OverlappingMarkerSpiderfier is not installed! require() it or include it from https://cdnjs.cloudflare.com/ajax/libs/OverlappingMarkerSpiderfier/1.0.3/oms.min.js');
    }

    var oms = new OverlappingMarkerSpiderfier(this.$map, options.spiderOption);
    if (!oms.setMaxZoom) {
      oms.setMaxZoom = function () {};
    }
    if (!oms.setCalculator) {
      oms.setCalculator = function () {};
    }
    if (!oms.setGridSize) {
      oms.setGridSize = function () {};
    }
    if (!oms.setStyles) {
      oms.setStyles = function () {};
    }
    if (!oms.setSpiderOption) {
      oms.setSpiderOption = function () {};
    }

    oms.addListener('format', function (marker, status) {
      var opened = status === OverlappingMarkerSpiderfier.markerStatus.SPIDERFIED;
      if (opened) {
        google.maps.event.trigger(marker, 'spider_open');
      } else {
        google.maps.event.trigger(marker, 'spider_close');
      }
      _this.$emit('update', { status: status, marker: marker });
    });

    this.$clusterObject = oms;

    (0, _propsBinder2.default)(this, this.$clusterObject, props, {
      afterModelChanged: function afterModelChanged(a, v) {
        // eslint-disable-line no-unused-vars
        var oldMarkers = _this.$clusterObject.getMarkers();
        _this.$clusterObject.clearMarkers();
        oldMarkers.forEach(function (marker) {
          _this.$clusterObject.addMarker(marker);
        });
      }
    });
    (0, _eventsBinder2.default)(this, this.$clusterObject, events);
  },
  beforeDestroy: function beforeDestroy() {
    var _this2 = this;

    /* Performance optimization when destroying a large number of markers */
    this.$children.forEach(function (marker) {
      if (marker.$clusterObject === _this2.$clusterObject) {
        marker.$clusterObject = null;
      }
    });

    if (this.$clusterObject) {
      this.$clusterObject.clearMarkers();
    }
  }
};