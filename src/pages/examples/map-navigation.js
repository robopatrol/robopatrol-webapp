import {inject} from 'aurelia-framework';

import {Ros} from '../../lib/ros';

@inject(Ros)
export class MapNavigation {

  constructor(ros) {
    this.ros = ros;
  }

  attached() {
    // Create the main viewer.
    var viewer = new ROS2D.Viewer({
      divID : 'nav',
      width : 400,
      height : 400
    });

    // Setup the nav client.
    var nav = NAV2D.OccupancyGridClientNav({
      ros : this.ros,
      rootObject : viewer.scene,
      viewer : viewer,
      serverName : '/move_base'
    });

    // example map click listener
    viewer.scene.addEventListener('click', (event) => {
      var coords = viewer.scene.getStage().globalToRos(event.stageX, event.stageY);
      var pose = new ROSLIB.Pose({
        position : new ROSLIB.Vector3(coords)
      });
      console.log("Coords:\nx: " + coords.x + "\ny: " + coords.y + "\nz: " + coords.z);
    });
  }
}
