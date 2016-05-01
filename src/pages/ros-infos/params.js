import {inject} from 'aurelia-framework';

import {Ros} from '../../lib/ros';

@inject(Ros)
export class RosParams {
  items = [];

  constructor(ros) {
    this.ros = ros;
  }

  activate() {
    this.ros.getParams().then(items => {this.items = items;})
  }
}
