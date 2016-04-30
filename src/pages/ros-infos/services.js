import {inject} from 'aurelia-framework';

import {Ros} from '../../lib/ros';

@inject(Ros)
export class RosServices {
  items = [];

  constructor(ros) {
    this.ros = ros;
  }

  activate() {
    this.ros.getServices().then(items => {this.items = items;})
  }
}
