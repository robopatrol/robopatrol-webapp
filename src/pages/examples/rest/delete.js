import {inject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {Router} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';


@inject(HttpClient, Router, EventAggregator)
export class Delete {
  id = null;

  constructor(http, router, ea) {
    this.http = http;
    this.router = router;
    this.ea = ea;
  }

  submit() {
    var body = { id: this.id };
    return this.http.fetch(`examples/${this.id}`, {
      method: 'delete'
    })
    .then(response => {
      this.ea.publish('notification', {type: "success", msg: `Example '${this.id}' deleted.`});
      this.router.navigateToRoute('list');
    });
  }

  activate(params, routerConfig) {
    this.id = params.id;
  }
}
