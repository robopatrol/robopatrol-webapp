import {inject} from 'aurelia-framework';

import {Ros, Topic, Message} from '../../lib/ros';

@inject(Ros)
export class DummyMove {
  heading = 'Dummy Move';
  speed = '0.5';

  constructor(ros) {
    this.ros = ros
    this.cmdVel = new Topic({
      ros : this.ros,
      name : '/cmd_vel_mux/input/navi',
      messageType : 'geometry_msgs/Twist'
    });
    this.twist = new Message({
      linear : {
        x : 0.0,
        y : 0.0,
        z : 0.0
      },
      angular : {
        x : 0.0,
        y : 0.0,
        z : 0.0
      }
    });
  }

  move() {
    this.twist.linear.x = parseFloat(this.speed);
    this.cmdVel.publish(this.twist);
  }
}
