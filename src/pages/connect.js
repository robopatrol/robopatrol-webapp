import {inject} from 'aurelia-framework';

import {Ros} from 'lib/ros';


@inject(Ros)
export class Connect {
  url = 'localhost:9090';
  autoConnect = true;

  constructor(ros, router) {
    this.ros = ros;
    if (this.autoConnect) {
      this.submit();
    }
  }

  submit() {
    //TODO: url validation (?)
    this.ros.connect(`ws:\/\/${this.url}`);
  }
}
