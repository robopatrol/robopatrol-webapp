import {inject} from 'aurelia-framework';

import {Ros, Topic, Message} from '../../lib/ros';

@inject(Ros)
export class Teleop {
  speed = 0.2;
  turn = 0.5;

  intervalIds = {};
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

  constructor(ros) {
    this.ros = ros;

    this.cmdVel = new Topic({
      ros : this.ros,
      name : 'cmd_vel_mux/input/navi',
      messageType : 'geometry_msgs/Twist'
    });

    this.twist = new Message({
        angular : {
          x : 0,
          y : 0,
          z : 0
        },
        linear : {
          x : 0,
          y : 0,
          z : 0
        }
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

  attached() {
    // Create the main viewer.
    var viewer = new ROS2D.Viewer({
      divID : 'map',
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
  }
}
