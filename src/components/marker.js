import { mapValues } from 'lodash';
import eventsBinder from '../utils/eventsBinder.js';
import propsBinder from '../utils/propsBinder.js';
import getPropsValuesMixin from '../utils/getPropsValuesMixin.js';
import MapElementMixin from './mapElementMixin';
// import LabeledMarker from './labeledMarker';

const props = {
  id: {
    type: String
  },
  animation: {
    twoWay: true,
    type: Number
  },
  attribution: {
    type: Object,
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
  label: {
  },
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
    twoWay: true,
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
    default: true,
  },
  clustering: {
    type: Boolean,
    default: true
  }
};

const events = [
  'click',
  'rightclick',
  'dblclick',
  'drag',
  'dragstart',
  'dragend',
  'mouseup',
  'mousedown',
  'mouseover',
  'mouseout'
];

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
export default {
  mixins: [MapElementMixin, getPropsValuesMixin],
  props: props,

  render(h) {
    if (!this.$slots.default || this.$slots.default.length == 0) {
      return '';
    } else if (this.$slots.default.length == 1) { // So that infowindows can have a marker parent
      return this.$slots.default[0];
    } else {
      return h(
        'div',
        this.$slots.default
      );
    }
  },

  destroyed() {
    if (!this.$markerObject)
      return;

    if (this.$clusterObject) {
      this.$clusterObject.removeMarker(this.$markerObject);
    }
    else {
      this.$markerObject.setMap(null);
    }
  },

  deferredReady() {
    const options = mapValues(props, (value, prop) => this[prop]);
    options.map = this.$map;
    delete options.options;
    Object.assign(options, this.options);

    // search ancestors for cluster object
    let search = this.$findAncestor(
      ans => ans.$clusterObject
    );

    this.$clusterObject = search ? search.$clusterObject : null;
    this.createMarker(options);
  },

  methods: {
    createMarker(options) {
      this.$markerObject = new google.maps.Marker(options);
      this.$markerObject.setId = id => { this.$markerObject.id = id; };
      this.$markerObject.setClustering = (clustering) => { this.$markerObject.clustering = clustering; };
      propsBinder(this, this.$markerObject, props);
      eventsBinder(this, this.$markerObject, events);

      if (this.$clusterObject) {
        if (options.clustering) {
          this.$clusterObject.addMarker(this.$markerObject);
          google.maps.event.addListener(this.$markerObject, 'click', () => {
            this.$emit('clickSpiderfier', { marker: this.$markerObject, oms: this.$clusterObject });
          });

          google.maps.event.addListener(this.$markerObject, 'spider_open', () => {
            this.$markerObject.spiderOpen = true;
            this.$emit('spiderOpen', { marker: this.$markerObject, oms: this.$clusterObject });
          });

          google.maps.event.addListener(this.$markerObject, 'spider_close', () => {
            this.$markerObject.spiderOpen = false;
            this.$emit('spiderClose', { marker: this.$markerObject, oms: this.$clusterObject });
          });
        } else {
          google.maps.event.addListener(this.$markerObject, 'click', () => {
            this.$emit('clickCenterOfSpiderfier', { marker: this.$markerObject, oms: this.$clusterObject });
          });
        }
      }
    }
  },
};
