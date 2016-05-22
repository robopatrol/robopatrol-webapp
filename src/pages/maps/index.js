import {inject} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {HttpClient, json} from 'aurelia-fetch-client';
import {MapService} from '../../services/map-service';

import {Create} from './create';
import {Edit} from './edit';

@inject(MapService, DialogService, HttpClient)
export class Index {

  items = [];

  constructor(mapService, dialogService, http) {
    this.mapService = mapService;
    this.dialogService = dialogService;
    this.http = http;
  }

  activate() {
    return this.loadMaps();
  }

  loadMaps() {
    return this.http.fetch('maps', {
          method: 'get'
        })
        .then(response => response.json())
        .then(body => {
          this.items = body;
        });
  }

  create() {
    this.mapService.startMapRecording()
      .then((response) => {
        this.dialogService.open({
          viewModel: Create
        }).then(response => {
          if (!response.wasCancelled) {
            this.loadMaps();
          }
        });
      })
      .catch((response) => {
        console.warn("Start map recording failed");
      });
  }

  delete(item) {
    this.mapService.deleteMap(item.id)
      .then((response) => {
        console.info("Map deleted");
        this.loadMaps();
      })
      .catch((response) => {
        console.warn("Deleting map failed");
      });
  }

  use(item) {
    this.mapService.startMapServer(item.filename)
      .then((response) => {
        console.info("Map server started");
        this.dialogService.open({
          viewModel: Edit
        }).then(response => {
          if (!response.wasCancelled) {
            // nothing to do
          }
        });
      })
      .catch((response) => {
        console.warn("Starting map server failed");
      });
  }
}
