import {inject} from 'aurelia-framework';

import {Ros, Topic, OccupancyGridLayer} from '../../lib/ros';

@inject(Ros)
export class LeafletRos {

  constructor(ros) {
    this.ros = ros;

    this.mapTopic = new Topic({
      ros: this.ros,
      name: '/map',
      messageType: 'nav_msgs/OccupancyGrid'
    });
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

    this.mapTopic.subscribe((message) => {
      this.occupancyGridLayer.update(message);
      this.map.fitBounds(this.occupancyGridLayer.getBounds());
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
