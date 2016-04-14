import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';

import {Ros} from 'lib/ros';


@inject(Ros, Router, EventAggregator)
export class Connect {
  url = 'localhost:9090';
  autoConnect = true;

  constructor(ros, router, ea) {
    this.ros = ros;
    this.router = router;
    this.ea = ea
  }

  activate(params, routeConfig, navigationInstruction){
    this.nextRoute = params.came_from || '/';
    if (this.autoConnect) {
      return this.submit();
    }
  }

  submit() {
    //TODO: url validation (?)
    return this.ros.connect(`ws:\/\/${this.url}`).then(() => {
      this.ea.publish('notification', {type: "success", msg: "Connected to websocket server."});
      this.router.navigate(this.nextRoute);
    }).catch((error) => {
      this.ea.publish('notification', {type: "danger", msg: `Error connecting to websocket server: ${error}`});
    });
  }
}
