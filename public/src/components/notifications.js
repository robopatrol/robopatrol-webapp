import {bindable, inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class Notifications {
  notification = null;

  constructor(ea) {
    this.ea = ea;
    this.ea.subscribe('notification', data => {
        this.notification = data;
    });
  }

  close(id) {
     this.notification = null
  }
}
