import {inject} from 'aurelia-framework';
import {Redirect} from 'aurelia-router';

import {Ros} from 'lib/ros';


@inject(Ros)
export class App {

  constructor(ros) {
    this.ros = ros;
  }

  configureRouter(config, router) {
    config.title = 'Robopatrol';
    config.addPipelineStep('preActivate', ConnectionStep)
    config.map([
      { route: ['', 'home'], name: 'home', moduleId: 'pages/home', nav: true, title: 'Home', connected: true },
      { route: 'connect', name: 'connect', moduleId: 'pages/connect', nav: false, title: 'Connect', connected: false },

      { route: 'ros-infos', name: 'ros-infos', moduleId: 'pages/ros-infos/index', nav: true, title: 'ROS Infos', connected: true },

      { route: 'dummy', name: 'dummy', moduleId: 'pages/dummy', nav: true, title: 'Dummy Move', connected: true },

      { route: 'disconnect', name: 'disconnect', moduleId: 'pages/disconnect', nav: true, title: 'Disconnect', connected: true },
    ]);

    this.router = router;
  }
}


@inject(Ros)
class ConnectionStep {

  constructor(ros) {
    this.ros = ros;
  }

  run(navigationInstruction, next) {
    if (navigationInstruction.getAllInstructions().some(i => i.config.connected)) {
      if (!this.ros.isConnected) {
        return next.cancel(new Redirect(`connect?came_from=${navigationInstruction.fragment}`));
      }
    }

    return next();
  }
}
