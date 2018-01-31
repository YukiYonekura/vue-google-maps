class LabeledMarker extends google.maps.MVCObject {
  constructor(map, marker, labelOptions) {
    super();
    this.setMap(map);
    this.setPosition(marker.getPosition());

    // MarkerとLabel(Overlay)を作成する
    // this.marker = this.createMarker(markerOptions);
    this.marker = marker;
    this.label = this.createLabel(labelOptions);
  }

  setMap(map) {
    this.set('map', map);
  }

  setPosition(position) {
    this.set('position', position);
  }

  createLabel(labelOptions) {
    const label = new google.maps.OverlayView();
    label.parent = this;
    label.bindTo('map', this);
    label.bindTo('position', this);
    label.onAdd = function () {
      const el = document.createElement('div');
      el.style.borderStyle = labelOptions.style.borderStyle || 'none';
      el.style.borderWidth = labelOptions.style.borderWidth || '0px';
      el.style.backgroundColor = labelOptions.style.backgroundColor || '';
      el.style.position = labelOptions.style.position || 'absolute';
      el.style.zIndex = labelOptions.style.zIndex || 100;
      // const styles = Object.assign({
      //   color: '#000',
      //   border: 'none',
      //   borderWidth: '0px',
      //   backgroundColor: '',
      //   position: 'absolute',
      //   zIndex: 100
      // }, labelOptions.style);

      // Object.keys(styles).forEach(style => {
      //   const val = labelOptions.style[style];
      //   if (val) {
      //     el.style[style] = val;
      //   }
      // });

      el.innerHTML = labelOptions.innerHTML || '<div>' + labelOptions.text + '</div>';
      this.el = el;
      const panes = this.getPanes();
      panes.overlayLayer.appendChild(el);
    };

    label.draw = function () {
      /* eslint no-console: 0 */
      console.log('draw:', this.el);
      if (!this.el) return;

      const overlayProjection = this.getProjection();
      const position = this.get('position');
      const xy = overlayProjection.fromLatLngToDivPixel(position);
      console.log('draw.xy:', xy);

      const el = this.el;
      el.style.left = xy.x + 'px';
      el.style.top = xy.y + 'px';
    };
    label.onRemove = function () {
      this.el.parentNode.removeChild(this.el);
      this.el = null;
    };
    label.position_changed = function () {
      this.draw(); // 親コンポーネントのポジションが変更されたら連動してラベルの表示位置を更新する
    };
    return label;
  }
}

module.exports = LabeledMarker;
