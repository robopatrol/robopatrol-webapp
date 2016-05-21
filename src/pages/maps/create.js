import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';
import {MapService} from '../../services/map-service';
import {Ros, Topic, Message, ActionClient, Goal, Pose} from '../../lib/ros';

@inject(DialogController, MapService, Ros)
export class Create {

  title = 'Create new map';
  data = {
    name: "",
    filename: ""
  };

  speed = 0.2;
  turn = 0.5;

  intervalIds = {};

  // 2d-array for nav buttons
  buttons = [[{
    action: 'forwards-left',
    icon: 'arrow-up rotate-left-45'
  }, {
    action: 'forwards',
    icon: 'arrow-up'
  }, {
    action: 'forwards-right',
    icon: 'arrow-up rotate-right-45'
  }], [{
    action: 'left',
    icon: 'arrow-left'
  }, {
    action: 'stop',
    icon: 'stop'
  }, {
    action: 'right',
    icon: 'arrow-right'
  }], [{
    action: 'backwards-left',
    icon: 'arrow-down rotate-right-45'
  }, {
    action: 'backwards',
    icon: 'arrow-down'
  }, {
    action: 'backwards-right',
    icon: 'arrow-down rotate-left-45'
  }]];

  constructor(controller, mapService, ros) {
    this.controller = controller;
    this.mapService = mapService;
    this.ros = ros;

    this.cmdVel = new Topic({
      ros : this.ros,
      name : 'cmd_vel_mux/input/navi',
      messageType : 'geometry_msgs/Twist'
    });

    this.twist = new Message({
      angular : { x : 0, y : 0, z : 0 },
      linear : { x : 0, y : 0, z : 0 }
    });

    // setup the actionlib client
    this.moveActionClient = new ActionClient({
      ros : this.ros,
      actionName : 'move_base_msgs/MoveBaseAction',
      serverName : '/move_base'
    });
  }

  activate() {
    // return promise to delay view activiation until map data is loaded
    return new Promise((resolve, reject) => {
      this.mapService.getDynamicMapImage().then((image) => {
        // create a leaflet image layer with base64 encoded data
        this.imageLayer = L.imageOverlay(image.data, image.bounds);

        // cretae layer for robot position
        this.robotLayer = L.marker([0,0]);

        return resolve();
      }).catch(() => {
        console.warn("Loading map data failed.")
        return reject()
      });
    });
  }

  deactivate() {
    //this.mapService.poseTopic.unsubscribe();
    this.mapService.amclPoseTopic.unsubscribe();
  }

  attached() {
    this.map = L.map('map-create', {
      crs: L.CRS.Simple
    });

    this.map.addLayer(this.imageLayer);
    this.map.addLayer(this.robotLayer);

    // zoom map to image extent
    this.map.fitBounds(this.imageLayer.getBounds());

    // listen to robot_pose topic
    /*this.mapService.poseTopic.subscribe((msg) => {
      let position = msg.position;
      this.robotLayer.setLatLng([position.y, position.x]);
    });*/

    // listen to amcl_pose topic
    this.mapService.amclPoseTopic.subscribe((msg) => {
      let position = msg.pose.pose.position;
      this.robotLayer.setLatLng([position.y, position.x]);
    });

    this.map.on('click', (e) => {
      //TODO: drive to this point
      console.log(e);
      this.moveTo(e.latlng);
    });
  }

  buttonHandle(event, action) {
    if (event.type === 'mousedown') {
      this.intervalIds[action] = setInterval(() => this.executeAction(action), 30);
    } else {
      clearInterval(this.intervalIds[action]);
    }
  }

  executeAction(action) {
    let linear, angular = 0;

    switch (action) {
      case 'forwards':
        linear = this.speed;
        angular = 0;
        break;
      case 'forwards-left':
        linear = this.speed;
        angular = this.turn;
        break;
      case 'forwards-right':
        linear = this.speed;
        angular = this.turn * -1;
        break;
      case 'left':
        linear = 0;
        angular = this.turn;
        break;
      case 'right':
        linear = 0;
        angular = this.turn * -1;
        break;
      case 'stop':
        linear = 0;
        angular = 0;
        break;
      case 'backwards':
        linear = this.speed * -1;
        angular = 0;
        break;
      case 'backwards-left':
        linear = this.speed * -1;
        angular = this.turn * -1;
        break;
      case 'backwards-right':
        linear = this.speed * -1;
        angular = this.turn;
        break;
      default:
        linear = 0;
        angular = 0;
        break;
    }

    this.twist.linear.x = linear;
    this.twist.angular.z = angular;
    this.cmdVel.publish(this.twist);
  }

  moveTo(latlng) {
    // create a goal
    var goal = new Goal({
      actionClient: this.moveActionClient,
      goalMessage: {
        target_pose: {
          header: {
            frame_id: '/map'
          },
          pose: {
            position: { x: latlng.lng, y: latlng.lat, z: 0 },
            orientation: { x: 0, y: 0, z: 0, w: 1 }
          }
        }
      }
    });
    // cancel current goal
    if (this.currentGoal) {
      this.currentGoal.cancel();
    }
    goal.send();

    this.currentGoal = goal;
  }

  refreshMap() {
    this.mapService.getDynamicMapImage().then((image) => {
      this.map.removeLayer(this.imageLayer);
      // create a leaflet image layer with base64 encoded data
      this.imageLayer = L.imageOverlay(image.data, image.bounds).addTo(this.map);

    }).catch(() => {
      console.warn("Refresh map data failed.")
    });
  }

  save() {
    if (!this.data.name || !this.data.filename) {
      // TODO: validation
      return;
    }
    if (!this.data.filename.endsWith('.yaml')) {
      this.data.filename = `${this.data.filename}.yaml`;
    }
    this.mapService.saveMap(this.data).then(() => {
      this.controller.ok();
    }).catch(() => {
      console.warn("Save map failed");
    });
  }
}
