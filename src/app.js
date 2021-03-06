import 'fetch';
import {inject} from 'aurelia-framework';
import {Redirect} from 'aurelia-router';

import {Ros} from './lib/ros';

@inject(Ros)
export class App {

  constructor(ros){
    this.ros = ros;
  }

  configureRouter(config, router) {
    config.title = 'Robopatrol';
    config.addPipelineStep('preActivate', ConnectionStep)
    config.map([
      { route: ['', 'home'], name: 'home', moduleId: 'pages/home', nav: true, title: 'Home', connected: true, settings: { startpage: false, last: false, enable: true, icon: '/img/page/home.png' } },
      { route: 'connect', name: 'connect', moduleId: 'pages/connect', nav: false, title: 'Connect', connected: false, settings: { startpage: false, last: false, enable: false, icon: '' } },
      { route: 'teleop', name: 'teleop', moduleId: 'pages/teleop/index', nav: true, title: 'Manual driving', connected: true, settings: { startpage: true, last: false, enable: true, icon: '/img/page/manual.png' } },
      { route: 'schedule', name: 'schedule', moduleId: 'pages/schedule/index', nav: true, title: 'Schedule patrol', connected: true, settings: { startpage: true, last: false, enable: true, icon: '/img/page/route.png' } },
      { route: 'maps', name: 'maps', moduleId: 'pages/maps/index', nav: true, title: 'Maps', connected: true, settings: { startpage: true, last: false, enable: true, icon: '/img/page/map.png' } },
      { route: 'battery', name: 'battery', moduleId: 'pages/ros-infos/battery', nav: true, title: 'Battery status', connected: true, settings: { startpage: true, last: false, enable: false, icon: '/img/page/battery.png' } },
      { route: 'images', name: 'images', moduleId: 'pages/images/index', nav: true, title: 'Images', connected: true, settings: { startpage: true, last: true, enable: true, icon: '/img/page/picture.png' } },
      { route: 'warnings', name: 'warnings', moduleId: 'pages/warnings', nav: true, title: 'Status', connected: true, settings: { startpage: true, last: true, enable: false, icon: '/img/page/warning.png' } },
      { route: 'settings', name: 'settings', moduleId: 'pages/settings', nav: true, title: 'Settings', connected: true, settings: { startpage: true, last: false, enable: false, icon: '/img/page/settings.png' } },
      { route: 'ros-infos', name: 'ros-infos', moduleId: 'pages/ros-infos/index', nav: true, title: 'ROS Infos', connected: true, settings: { startpage: true, last: false, enable: true, icon: '/img/page/info.png' } },
      { route: 'examples', name: 'examples', moduleId: 'pages/examples/index', nav: true, title: 'Examples', connected: true, settings: { startpage: false, last: false, enable: false, icon: '' } },
      { route: 'disconnect', name: 'disconnect', moduleId: 'pages/disconnect', nav: true, title: 'Disconnect', connected: true, settings: { startpage: false, last: false, enable: false, icon: '' } }
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
