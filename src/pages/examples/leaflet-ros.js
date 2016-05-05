import {inject, bindable} from 'aurelia-framework';
import {MapService} from '../../services/map-service';


@inject(MapService)
export class LeafletRos {

  @bindable editLayer = null;

  constructor(mapService) {
    this.mapService = mapService;
  }

  attached() {
    this.mapService.getStaticImage().then((image) => {
      let bounds = [[0, 0], [image.width * image.resolution, image.height * image.resolution]];

      this.map = L.map('maptest', {
        crs: L.CRS.Simple,
        editable: true
      });

      this.imageLayer = L.imageOverlay(image.data, bounds).addTo(this.map);

      this.map.fitBounds(this.imageLayer.getBounds());
    });
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
      // save data
      this.editLayer.disableEdit();
    }
  }

  show() {
    // create random path
    let bounds = this.imageLayer.getBounds();
    let xMax = bounds.getEast();
    let yMax = bounds.getNorth();
    let latLngs = [];

    for (let i = 0; i < 7; i++) {
      let x = Math.round(Math.random() * xMax);
      let y = Math.round(Math.random() * yMax);
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
