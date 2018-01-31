'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mapValues2 = require('lodash/mapValues');

var _mapValues3 = _interopRequireDefault(_mapValues2);

var _eventsBinder = require('../utils/eventsBinder.js');

var _eventsBinder2 = _interopRequireDefault(_eventsBinder);

var _propsBinder = require('../utils/propsBinder.js');

var _propsBinder2 = _interopRequireDefault(_propsBinder);

var _getPropsValuesMixin = require('../utils/getPropsValuesMixin.js');

var _getPropsValuesMixin2 = _interopRequireDefault(_getPropsValuesMixin);

var _mapElementMixin = require('./mapElementMixin');

var _mapElementMixin2 = _interopRequireDefault(_mapElementMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import LabeledMarker from './labeledMarker';

var props = {
  id: {
    type: String
  },
  animation: {
    twoWay: true,
    type: Number
  },
  attribution: {
    type: Object
  },
  clickable: {
    type: Boolean,
    twoWay: true,
    default: true
  },
  cursor: {
    type: String,
    twoWay: true
  },
  draggable: {
    type: Boolean,
    twoWay: true,
    default: false
  },
  icon: {
    twoWay: true
  },
  label: {},
  opacity: {
    type: Number,
    default: 1
  },
  options: {
    type: Object
  },
  place: {
    type: Object
  },
  position: {
    type: Object,
    twoWay: true
  },
  shape: {
    type: Object,
    twoWay: true
  },
  title: {
    type: String,
    twoWay: true
  },
  zIndex: {
    type: Number,
    twoWay: true
  },
  visible: {
    twoWay: true,
    default: true
  },
  clustering: {
    type: Boolean,
    default: true
  }
};

var events = ['click', 'rightclick', 'dblclick', 'drag', 'dragstart', 'dragend', 'mouseup', 'mousedown', 'mouseover', 'mouseout'];

/**
 * @class Marker
 *
 * Marker class with extra support for
 *
 * - Embedded info windows
 * - Clustered markers
 *
 * Support for clustered markers is for backward-compatability
 * reasons. Otherwise we should use a cluster-marker mixin or
 * subclass.
 */
exports.default = {
  mixins: [_mapElementMixin2.default, _getPropsValuesMixin2.default],
  props: props,

  render: function render(h) {
    if (!this.$slots.default || this.$slots.default.length == 0) {
      return '';
    } else if (this.$slots.default.length == 1) {
      // So that infowindows can have a marker parent
      return this.$slots.default[0];
    } else {
      return h('div', this.$slots.default);
    }
  },
  destroyed: function destroyed() {
    if (!this.$markerObject) return;

    if (this.$clusterObject) {
      this.$clusterObject.removeMarker(this.$markerObject);
    } else {
      this.$markerObject.setMap(null);
    }
  },
  deferredReady: function deferredReady() {
    var _this = this;

    var options = (0, _mapValues3.default)(props, function (value, prop) {
      return _this[prop];
    });
    options.map = this.$map;
    delete options.options;
    Object.assign(options, this.options);

    // search ancestors for cluster object
    var search = this.$findAncestor(function (ans) {
      return ans.$clusterObject;
    });

    this.$clusterObject = search ? search.$clusterObject : null;
    this.createMarker(options);
  },


  methods: {
    createMarker: function createMarker(options) {
      var _this2 = this;

      this.$markerObject = new google.maps.Marker(options);
      this.$markerObject.setId = function (id) {
        _this2.$markerObject.id = id;
      };
      this.$markerObject.setClustering = function (clustering) {
        _this2.$markerObject.clustering = clustering;
      };
      (0, _propsBinder2.default)(this, this.$markerObject, props);
      (0, _eventsBinder2.default)(this, this.$markerObject, events);

      if (this.$clusterObject) {
        if (options.clustering) {
          this.$clusterObject.addMarker(this.$markerObject);
          google.maps.event.addListener(this.$markerObject, 'click', function () {
            _this2.$emit('clickSpiderfier', { marker: _this2.$markerObject, oms: _this2.$clusterObject });
          });

          google.maps.event.addListener(this.$markerObject, 'spider_open', function () {
            _this2.$markerObject.spiderOpen = true;
            _this2.$emit('spiderOpen', { marker: _this2.$markerObject, oms: _this2.$clusterObject });
          });

          google.maps.event.addListener(this.$markerObject, 'spider_close', function () {
            _this2.$markerObject.spiderOpen = false;
            _this2.$emit('spiderClose', { marker: _this2.$markerObject, oms: _this2.$clusterObject });
          });
        } else {
          google.maps.event.addListener(this.$markerObject, 'click', function () {
            _this2.$emit('clickCenterOfSpiderfier', { marker: _this2.$markerObject, oms: _this2.$clusterObject });
          });
        }
      }
    }
  }
};