import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';

import {Ros} from 'lib/ros';


@inject(Ros, Router, EventAggregator)
export class Disconnect {
  url = 'localhost:9090';

  constructor(ros, router, ea) {
    this.ros = ros;
    this.router = router;
    this.ea = ea;
  }

  activate() {
    this.ros.close().then(() => {
      this.ea.publish('notification', {type: "warning", msg: "Connection to websocket server closed."});
      this.router.navigate('/');
    });
  }
}
