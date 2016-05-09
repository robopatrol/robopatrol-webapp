import {inject, bindable} from 'aurelia-framework';
import {MapService} from '../../services/map-service';


@inject(MapService)
export class LeafletRos {

  editLayer = null;

  constructor(mapService) {
    this.mapService = mapService;
  }

  activate() {
    // return promise to delay view activiation until map data is loaded
    return new Promise((resolve, reject) => {
      this.mapService.getStaticMapImage().then((image) => {

        // create a leaflet image layer with base64 encoded data
        this.imageLayer = L.imageOverlay(image.data, image.bounds);

        return resolve();
      }).catch(() => {
        console.warn("Loading map data failed.")
        return reject()
      });
    });
  }

  attached() {
    // create leaflet map after dom is ready
    this.map = L.map('maptest', {
      crs: L.CRS.Simple,
      editable: true
    });

    this.map.addLayer(this.imageLayer);

    // zoom map to image extent
    this.map.fitBounds(this.imageLayer.getBounds());
  }

  deactivate() {
    this.map.editTools.stopDrawing();
  }

  create() {
    this.clean();
    this.editLayer = this.map.editTools.startPolyline();
  }

  save() {
    if (this.editLayer && !this.map.editTools.drawing()) {
      // save data xy = array of y,x values
      alert("Save: " + his.editLayer.getLatLngs());
      this.editLayer.disableEdit();
    }
  }

  show() {
    // create random path
    let bounds = this.imageLayer.getBounds();
    let xMax = Math.abs(bounds.getEast()) + Math.abs(bounds.getWest());
    let yMax = Math.abs(bounds.getNorth()) + Math.abs(bounds.getSouth());
    let latLngs = [];

    for (let i = 0; i < 7; i++) {
      let x = Math.random() * xMax - Math.abs(bounds.getWest());
      let y = Math.random() * yMax - Math.abs(bounds.getSouth());
      // Lat (Latitude) means North/Sourth = y ; Lng (Longitude) means Ease/West = x
      latLngs.push(L.latLng(y, x));
    }

    this.clean();
    this.editLayer = L.polyline(latLngs).addTo(this.map);
  }

  edit() {
    if (this.editLayer && !this.editLayer.editEnabled()) {
      this.editLayer.enableEdit();
    }
  }

  clean() {
    this.map.editTools.stopDrawing();
    if (this.editLayer) {
      this.map.removeLayer(this.editLayer);
      this.editLayer = null;
    }
  }
}
