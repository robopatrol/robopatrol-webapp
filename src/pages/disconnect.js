import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';

import {Ros} from 'lib/ros';


@inject(Ros, Router)
export class Disconnect {
  url = 'localhost:9090';

  constructor(ros, router) {
    this.ros = ros;
    this.router = router;
  }

  activate() {
    this.ros.close();
    this.router.navigate('');
  }
}
