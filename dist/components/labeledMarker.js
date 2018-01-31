'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LabeledMarker = function (_google$maps$MVCObjec) {
  _inherits(LabeledMarker, _google$maps$MVCObjec);

  function LabeledMarker(map, marker, labelOptions) {
    _classCallCheck(this, LabeledMarker);

    var _this = _possibleConstructorReturn(this, (LabeledMarker.__proto__ || Object.getPrototypeOf(LabeledMarker)).call(this));

    _this.setMap(map);
    _this.setPosition(marker.getPosition());

    // MarkerとLabel(Overlay)を作成する
    // this.marker = this.createMarker(markerOptions);
    _this.marker = marker;
    _this.label = _this.createLabel(labelOptions);
    return _this;
  }

  _createClass(LabeledMarker, [{
    key: 'setMap',
    value: function setMap(map) {
      this.set('map', map);
    }
  }, {
    key: 'setPosition',
    value: function setPosition(position) {
      this.set('position', position);
    }
  }, {
    key: 'createLabel',
    value: function createLabel(labelOptions) {
      var label = new google.maps.OverlayView();
      label.parent = this;
      label.bindTo('map', this);
      label.bindTo('position', this);
      label.onAdd = function () {
        var el = document.createElement('div');
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
        var panes = this.getPanes();
        panes.overlayLayer.appendChild(el);
      };

      label.draw = function () {
        /* eslint no-console: 0 */
        console.log('draw:', this.el);
        if (!this.el) return;

        var overlayProjection = this.getProjection();
        var position = this.get('position');
        var xy = overlayProjection.fromLatLngToDivPixel(position);
        console.log('draw.xy:', xy);

        var el = this.el;
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
  }]);

  return LabeledMarker;
}(google.maps.MVCObject);

module.exports = LabeledMarker;