import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Router} from 'aurelia-router';


@inject(Router, EventAggregator)
export class Ros extends ROSLIB.Ros {

  constructor(router, ea) {
    super();

    this.router = router;
    this.ea = ea;

    this.on('error', function(error) {
        this.ea.publish('notification', {type: "danger", msg: `Error connecting to websocket server: ${error}`});
    }.bind(this));

    this.on('connection', function() {
        this.ea.publish('notification', {type: "success", msg: "Connected to websocket server."});
        this.router.navigate('');
    }.bind(this));

    this.on('close', function() {
        this.ea.publish('notification', {type: "warning", msg: "Connection to websocket server closed."});
        this.router.navigate('');
    }.bind(this));

  }
}

export class Topic extends ROSLIB.Topic {}

export class Message extends ROSLIB.Message {}
