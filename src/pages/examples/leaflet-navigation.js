import {inject, bindable} from 'aurelia-framework';
import {MapService} from '../../services/map-service';
import {Ros, Topic} from '../../lib/ros';


@inject(Ros, MapService)
export class LeafletNavigation {

  constructor(ros, mapService) {
    this.ros = ros;
    this.mapService = mapService;

    this.poseTopic = new Topic({
      ros: this.ros,
      name: '/robot_pose',
      messageType: 'geometry_msgs/Pose',
      throttle_rate: 100
      //name: '/amcl_pose',
      //messageType: 'geometry_msgs/PoseWithCovarianceStamped',
    });
  }

  activate() {
    // return promise to delay view activiation until map data is loaded
    return new Promise((resolve, reject) => {
      this.mapService.getStaticMapImage().then((image) => {
        // create a leaflet image layer with base64 encoded data
        this.imageLayer = L.imageOverlay(image.data, image.bounds);
        this.robotLayer = L.marker([0,0]);
        this.robotLayer.on('click', function(e) {console.log(e);});

        this.poseTopic.subscribe((msg) => {
          this.updateRobotPosition(msg.position, msg.orientation);
        });

        return resolve();
      }).catch(() => {
        console.warn("Loading map data failed.")
        return reject()
      });
    });
  }

  attached() {
    // create leaflet map after dom is ready
    this.map = L.map('nav', {
      crs: L.CRS.Simple,
      editable: true
    });

    this.map.addLayer(this.imageLayer);
    this.map.addLayer(this.robotLayer);

    // zoom map to image extent
    this.map.fitBounds(this.imageLayer.getBounds());
  }

  deactivate() {
    this.poseTopic.unsubscribe();
  }

  updateRobotPosition(position, orientation) {
    this.robotLayer.setLatLng([position.y, position.x]);
  }
}
