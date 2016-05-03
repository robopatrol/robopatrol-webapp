
export class Ros extends ROSLIB.Ros {

  connect(url) {
    return new Promise((resolve, reject) => {
      this.once('connection', function() {
         return resolve();
      });
      this.once('error', function(error) {
         return reject(error);
      });
      super.connect(url);
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.once('close', function() {
        return resolve();
      });
      super.close();
    });
  }

  getNodes() {
    return new Promise((resolve, reject) => {
      super.getNodes(resolve, reject);
    });
  }

  getParams() {
    return new Promise((resolve, reject) => {
      super.getParams(resolve, reject);
    });
  }

  getServices() {
    return new Promise((resolve, reject) => {
      super.getServices(resolve, reject);
    });
  }

  getTopics() {
    return new Promise((resolve, reject) => {
      super.getTopics(resolve, reject);
    });
  }
}

export class Topic extends ROSLIB.Topic {}

export class Message extends ROSLIB.Message {}

export class Service extends ROSLIB.Service {}

export class ServiceRequest extends ROSLIB.ServiceRequest {}

export class OccupancyGridLayer extends L.Layer {
  /* Most of the code was stolen from:
   * - https://github.com/Leaflet/Leaflet.heat
   * - https://github.com/mourner/simpleheat
   */

  onAdd(map) {
    this._map = map;

    if (!this._canvas) {
      this._initCanvas();
    }

    map._panes.overlayPane.appendChild(this._canvas);

    map.on('moveend', this._reset, this);

    if (map.options.zoomAnimation && L.Browser.any3d) {
      map.on('zoomanim', this._animateZoom, this);
    }

    this._reset();
  }

  onRemove(map) {
    map.getPanes().overlayPane.removeChild(this._canvas);

    map.off('moveend', this._reset, this);

    if (map.options.zoomAnimation) {
      map.off('zoomanim', this._animateZoom, this);
    }
  }

  addTo(map) {
    map.addLayer(this);
    return this;
  }

  getBounds() {
    return L.latLngBounds([[0,0], [this._info.width, this._info.height]]);
  }

  update(message) {
    this._info = message.info;
    this._data = message.data.map((value, index) => {
      return {
        latlng: L.latLng(Math.floor(index / message.info.width), index % message.info.width),
        value: value
      };
    }).filter((point) => {
      return point.value !== 0;
    });

    return this.redraw();
  }

  redraw() {
    if (this._canvas && !this._frame && !this._map._animating) {
      this._frame = L.Util.requestAnimFrame(this._redraw, this);
    }
    return this;
  }


  updatePixel(scale) {
    if (!this._pixel) {
      this._pixel = document.createElement('canvas');
    }
    let ctx = this._pixel.getContext('2d');
    let size = 1 * scale;

    this._pixel.width = this._pixel.height = size;

    ctx.beginPath();
    //ctx.rect(0,0,1,1);
    ctx.rect(0, 0, size, size);
    ctx.closePath();
    ctx.fillStyle = '#000';
    ctx.fill();

    return this;
  }

  _initCanvas() {
    var canvas = L.DomUtil.create('canvas', 'leaflet-heatmap-layer leaflet-layer');
    var originProp = L.DomUtil.testProp(['transformOrigin', 'WebkitTransformOrigin', 'msTransformOrigin']);
    var size = this._map.getSize();
    var animated = this._map.options.zoomAnimation && L.Browser.any3d;

    canvas.style[originProp] = '50% 50%';

    canvas.width  = size.x;
    canvas.height = size.y;

    L.DomUtil.addClass(canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'));

    this._canvas = canvas;
  }

  _reset() {
    var topLeft = this._map.containerPointToLayerPoint([0, 0]);
    var size = this._map.getSize();

    L.DomUtil.setPosition(this._canvas, topLeft);

    if (this._canvas.width !== size.x) {
      this._canvas.width = size.x;
    }
    if (this._canvas.height !== size.y) {
      this._canvas.height = size.y;
    }

    this._redraw();
  }

  _redraw() {
    if (!this._map) {
        return;
    }

    let size = this._map.getSize();
    let bounds = this._map.getBounds();
    let bottomLeft = this._map.latLngToContainerPoint([0, 0]);
    let topRight = this._map.latLngToContainerPoint([this._info.height, this._info.width]);
    var scale = Math.abs((topRight.x - bottomLeft.x) / this._info.width);

    let ctx = this._canvas.getContext('2d');

    ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

    // draw ros map extent
    ctx.beginPath();
    ctx.rect(bottomLeft.x, bottomLeft.y, topRight.x - bottomLeft.x, topRight.y - bottomLeft.y);
    ctx.strokeStyle = 'red';
    ctx.stroke();

    this.updatePixel(scale);

    this._data.forEach((item) => {
      if (bounds.contains(item.latlng)) {
        let point = this._map.latLngToContainerPoint(item.latlng);
        let alphaValue = (item.value < 0) ? 50 : item.value;

        ctx.globalAlpha = alphaValue / 100;
        ctx.drawImage(this._pixel, point.x - scale/2, point.y - scale/2);
      }
    });

    this._frame = null;
  }

  _animateZoom(e) {
    var scale = this._map.getZoomScale(e.zoom);
    var offset = this._map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(this._map._getMapPanePos());

    if (L.DomUtil.setTransform) {
      L.DomUtil.setTransform(this._canvas, offset, scale);
    } else {
      this._canvas.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(offset) + ' scale(' + scale + ')';
    }
  }
}
