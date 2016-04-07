import {inject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {Router} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';


@inject(HttpClient, Router, EventAggregator)
export class Detail {
  name = null;

  constructor(http, router, ea) {
    this.http = http;
    this.router = router;
    this.ea = ea;
  }

  submit() {
    var body = { id: this.id, name: this.name };
    return this.http.fetch(`examples`, {
      method: 'post',
      body: json(body)
    })
      .then(response => response.json())
      .then(body => {
        this.ea.publish('notification', {type: "success", msg: `Example '${body.data.id}' created.`});
        this.router.navigateToRoute('detail', {id: body.data.id});
      });
  }
}
