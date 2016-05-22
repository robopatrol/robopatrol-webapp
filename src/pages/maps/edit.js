import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';
import {MapService} from '../../services/map-service';
import {Ros, Topic, Message} from '../../lib/ros';

@inject(DialogController, MapService, Ros)
export class Edit {

  title = 'Set robot position';

  constructor(controller, mapService, ros) {
    this.controller = controller;
    this.mapService = mapService;
    this.ros = ros;

    this.initialPoseTopic = new Topic({
      ros : this.ros,
      name : '/initialpose',
      messageType : 'geometry_msgs/PoseWithCovarianceStamped'
    });
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

  deactivate() {
    //this.mapService.poseTopic.unsubscribe();
    //this.mapService.amclPoseTopic.unsubscribe();
  }

  attached() {
    this.map = L.map('map-edit', {
      crs: L.CRS.Simple,
      editable: true,
      editOptions: { skipMiddleMarkers: true }
    });

    this.map.addLayer(this.imageLayer);

    // zoom map to image extent
    this.map.fitBounds(this.imageLayer.getBounds());


    // create orientation/position arrow
    this.mapService.amclPoseTopic.subscribe((msg) => {
      this.mapService.amclPoseTopic.unsubscribe();
      if (!this.arrowLayer) {
        let position = msg.pose.pose.position;
        let orientation = msg.pose.pose.orientation;
        let angle = Math.abs(Math.asin(orientation.z) * 2);
        this.arrowLayer = L.polyline([
          [position.y, position.x],
          [position.y + 2*Math.sin(angle), position.x + 2*Math.cos(angle)]
        ], {}).addTo(this.map);
        this.arrowHead = L.polylineDecorator(this.arrowLayer).addTo(this.map);
        this.updatePattern();

        this.arrowLayer.enableEdit();

        this.map.on('editable:vertex:drag', (e) => {
          this.updatePattern();
        });
      }
    });
  }

  updatePattern() {
    this.arrowHead.setPatterns([
        {offset: '100%', repeat: 0, symbol: L.Symbol.arrowHead({pixelSize: 15, polygon: false, pathOptions: {stroke: true}})}
    ]);
  }

  save() {
    if (!this.arrowLayer) {
      return;
    }
    let latlngs = this.arrowLayer.getLatLngs();
    let angle = Math.atan2(latlngs[1].lat - latlngs[0].lat, latlngs[1].lng - latlngs[0].lng);
    // covaraince stolen from rostopic echo /initialpose, seems to be always the same
    let covariance = [0.25, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.25, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.06853891945200942];
    let msg = new Message({
      header: { frame_id: '/map' },
      pose: {
        pose: {
          position: { x: latlngs[0].lng, y: latlngs[0].lat, z: 0 },
          orientation: { x: 0, y: 0, z: Math.sin(angle/2), w: Math.cos(angle/2) }
        },
        covariance: covariance
      }
    });

    this.initialPoseTopic.publish(msg);
    this.controller.ok();
  }
}
