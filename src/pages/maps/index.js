import {inject} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {Edit} from './edit';
import {Prompt} from './prompt';
import {HttpClient, json} from 'aurelia-fetch-client';
import {EventAggregator} from 'aurelia-event-aggregator';
import {MapService} from '../../services/map-service'

@inject(MapService, DialogService, HttpClient, EventAggregator)
export class Index {

  entries = [];

  constructor(mapService, dialogService, http, ea) {
    this.mapService = mapService;
    this.dialogService = dialogService;
    this.http = http;
    this.ea = ea;
  }

  activate() {
    this.load();
  }

  load() {
    return new Promise((resolve, reject) => {
      // TODO: load maps from db
      this.entries = [{
        name: 'Playground',
        filename: 'playground.yaml'
      }, {
        name: 'ICC Lab',
        filename: 'icclab.yaml'
      }, {
        name: 'Willow',
        filename: 'willow.yaml'
      }];
    });
    return resolve();
  }

  use(entry) {
    this.mapService.loadMap(entry.filename)
      .then((response) => {
        console.log(response);
      })
      .catch((response) => {
        console.log(response);
      });
  }
}
