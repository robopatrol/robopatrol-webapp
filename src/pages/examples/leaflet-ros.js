import {inject} from 'aurelia-framework';

import {MapService} from '../../services/map-service';
import {OccupancyGridLayer} from '../../lib/ros';

@inject(MapService)
export class LeafletRos {

  constructor(mapService) {
    this.mapService = mapService;
  }

  attached() {
    this.map = L.map('maptest', {
      crs: L.CRS.Simple,
      editable: true
    });

    this.occupancyGridLayer = new OccupancyGridLayer().addTo(this.map);

    this.map.on('click', (e) => {
      console.log("Lat/Y: " + e.latlng.lat + " Lng/X: " + e.latlng.lng);
    });

      this.map.fitBounds(this.occupancyGridLayer.getBounds());
    this.mapService.getMap().then((data) => {
      this.occupancyGridLayer.update(data);
    });
  }
  deactivate() {
    this.map.editTools.stopDrawing();
  }

  newPatrol() {
      this.map.editTools.startPolyline();
      this.map.on('editable:drawing:end', (e) => {
        let waypoints = e.layer.getLatLngs().map((latlng) => {
          return { x: latlng.lng, y: latlng.lat };
        });
      });
  }
}
