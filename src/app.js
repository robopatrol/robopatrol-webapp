import 'fetch';
import {inject} from 'aurelia-framework';
import {Redirect} from 'aurelia-router';
import {HttpClient} from 'aurelia-fetch-client';

import {Ros} from 'lib/ros';


@inject(HttpClient, Ros)
export class App {

  constructor(http, ros) {
    http.configure(config => {
      config
        .withBaseUrl('api/')
        .withDefaults({
          headers: {
            'Accept': 'application/json'
          }
        })
        .withInterceptor({
          request(request) {
            return request;
          },
          response(response) {
            // TODO: take care of other 2XX success codes
            if (response.status !== 200) {
            	throw response;
            } else {
            	return response;
            }
          }
        });
    });

    this.http = http;
    this.ros = ros;
  }

  configureRouter(config, router) {
    config.title = 'Robopatrol';
    config.addPipelineStep('preActivate', ConnectionStep)
    config.map([
      { route: ['', 'home'], name: 'home', moduleId: 'pages/home', nav: true, title: 'Home', connected: true },
      { route: 'connect', name: 'connect', moduleId: 'pages/connect', nav: false, title: 'Connect', connected: false },

      { route: 'ros-infos', name: 'ros-infos', moduleId: 'pages/ros-infos/index', nav: true, title: 'ROS Infos', connected: true },
      { route: 'examples', name: 'examples', moduleId: 'pages/examples/index', nav: true, title: 'Examples', connected: true },

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
