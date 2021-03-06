import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';
import {HttpClient} from 'aurelia-fetch-client';

import {Ros} from '../lib/ros';


@inject(Ros, Router, HttpClient, EventAggregator)
export class Connect {
  heading = 'Connect to Robopatrol';
  wsUrl = `${window.location.hostname}:9090`;
  restUrl = `${window.location.hostname}:9998`;
  nextRoute = '/';
  autoConnect = true;

  constructor(ros, router, http, ea) {
    this.ros = ros;
    this.router = router;
    this.http = http;
    this.ea = ea;
  }

  activate(params, routeConfig, navigationInstruction){
    this.nextRoute = params.came_from || '/';
    if (this.autoConnect) {
      return this.submit();
    }
  }

  submit() {
    //TODO: url validation (?)
    this.http.configure(config => {
      config
        .withBaseUrl(`http:\/\/${this.restUrl}\/`)
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
    return this.ros.connect(`ws:\/\/${this.wsUrl}`).then(() => {
      this.ea.publish('notification', {type: "success", msg: "Connected to websocket server."});
      this.router.navigate(this.nextRoute);
    }).catch((error) => {
      this.ea.publish('notification', {type: "danger", msg: `Error connecting to websocket server: ${error}`});
    });
  }
}
