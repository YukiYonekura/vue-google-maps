/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

/**
  * @class Cluster
  * @prop $clusterObject -- Exposes the marker clusterer to
        descendent Marker classes. Override this if you area
        extending the class
**/

import { clone } from 'lodash';
import eventsBinder from '../utils/eventsBinder.js';
import propsBinder from '../utils/propsBinder.js';
import MapElementMixin from './mapElementMixin';
import getPropsValuesMixin from '../utils/getPropsValuesMixin.js';
// import MarkerClusterer from 'marker-clusterer-plus';

const props = {
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


export default {
  mixins: [MapElementMixin, getPropsValuesMixin],
  props: props,

  render(h) {
    // <div><slot></slot></div>
    return h(
      'div',
      this.$slots.default
    );
  },

  deferredReady() {
    const options = clone(this.getPropsValues());

    if (typeof OverlappingMarkerSpiderfier === 'undefined') {
      /* eslint-disable no-console */
      console.error('OverlappingMarkerSpiderfier is not installed! require() it or include it from https://cdnjs.cloudflare.com/ajax/libs/OverlappingMarkerSpiderfier/1.0.3/oms.min.js');
      throw new Error('OverlappingMarkerSpiderfier is not installed! require() it or include it from https://cdnjs.cloudflare.com/ajax/libs/OverlappingMarkerSpiderfier/1.0.3/oms.min.js');
    }

    const oms = new OverlappingMarkerSpiderfier(this.$map, options.spiderOption);
    if (!oms.setMaxZoom) { oms.setMaxZoom = () => { }; }
    if (!oms.setCalculator) { oms.setCalculator = () => { }; }
    if (!oms.setGridSize) { oms.setGridSize = () => { }; }
    if (!oms.setStyles) { oms.setStyles = () => { }; }
    if (!oms.setSpiderOption) { oms.setSpiderOption = () => { }; }

    oms.addListener('format', (marker, status) => {
      const opened = status === OverlappingMarkerSpiderfier.markerStatus.SPIDERFIED;
      if (opened) {
        google.maps.event.trigger(marker, 'spider_open');
      } else {
        google.maps.event.trigger(marker, 'spider_close');
      }
      this.$emit('update', { status, marker });
    });

    this.$clusterObject = oms;

    propsBinder(this, this.$clusterObject, props, {
      afterModelChanged: (a, v) => { // eslint-disable-line no-unused-vars
        const oldMarkers = this.$clusterObject.getMarkers();
        this.$clusterObject.clearMarkers();
        oldMarkers.forEach(marker => {
          this.$clusterObject.addMarker(marker);
        });
      }
    });
    eventsBinder(this, this.$clusterObject, events);
  },

  beforeDestroy() {
    /* Performance optimization when destroying a large number of markers */
    this.$children.forEach(marker => {
      if (marker.$clusterObject === this.$clusterObject) {
        marker.$clusterObject = null;
      }
    });

    if (this.$clusterObject) {
      this.$clusterObject.clearMarkers();
    }
  },
};
