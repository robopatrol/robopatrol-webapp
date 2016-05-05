import {inject, bindable} from 'aurelia-framework';

import {MapService} from '../../services/map-service';
import {OccupancyGridLayer} from '../../lib/ros';

@inject(MapService)
export class LeafletRos {

  @bindable editLayer = null;

  constructor(mapService) {
    this.mapService = mapService;
  }

  attached() {
    this.map = L.map('maptest', {
      crs: L.CRS.Simple,
      editable: true,
      zoom: 1
    });

    this.occupancyGridLayer = new OccupancyGridLayer().addTo(this.map);

    this.mapService.getMap().then((data) => {
      this.occupancyGridLayer.update(data);
      this.map.panTo(this.occupancyGridLayer.getCenter());
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
    let bounds = this.occupancyGridLayer.getBounds();
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
