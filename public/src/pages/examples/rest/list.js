import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';


@inject(HttpClient)
export class List {
  items = [];

  constructor(http) {
    this.http = http;
  }

  activate(params, routerConfig) {
    return this.http.fetch('examples', {method: 'get'})
      .then(response => response.json())
      .then(body => this.items = body.data);
  }
}
