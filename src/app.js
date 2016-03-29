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
      { route: 'users',         name: 'users',        moduleId: 'users',        nav: true, title: 'Github Users' },
      { route: 'child-router',  name: 'child-router', moduleId: 'child-router', nav: true, title: 'Child Router' }
      { route: 'connect', name: 'connect', moduleId: 'pages/connect', nav: false, title: 'Connect', connected: false },
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
        return next.cancel(new Redirect('connect'));
      }
    }

    return next();
  }
}
