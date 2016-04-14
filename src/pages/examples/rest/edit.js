import {inject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {Router} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';


@inject(HttpClient, Router, EventAggregator)
export class Edit {
  item = null;

  constructor(http, router, ea) {
    this.http = http;
    this.router = router;
    this.ea = ea;
  }

  activate(params, routerConfig) {
    return this.http.fetch(`examples/${params.id}`, {method: 'get'})
      .then(response => response.json())
      .then(body => this.item = body.data)
      .catch(error => {
        this.ea.publish('notification', {type: "info", msg: `${error.status} ${error.statusText} (${error.url})`});
        this.router.navigateToRoute('list');
      });
  }

  submit() {
    var body = this.item;
    return this.http.fetch(`examples/${this.item.id}`, {
        method: 'put',
        body: json(body)
      })
      .then(response => response.json())
      .then(body => {
        this.ea.publish('notification', {type: "success", msg: `Example '${body.data.id}' updated.`});
        this.router.navigateToRoute('detail', {id: body.data.id});
      });
  }
}
