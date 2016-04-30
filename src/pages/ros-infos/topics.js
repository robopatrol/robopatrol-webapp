import {inject} from 'aurelia-framework';

import {Ros} from '../../lib/ros';

@inject(Ros)
export class RosTopics {
  items = [];

  constructor(ros) {
    this.ros = ros;
  }

  activate() {
    this.ros.getTopics().then(items => {this.items = items;})
  }
}
