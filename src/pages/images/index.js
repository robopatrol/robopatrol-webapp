import {inject} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {Prompt} from './prompt';
import {HttpClient, json} from 'aurelia-fetch-client';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(DialogService, HttpClient, EventAggregator)
export class Pictures {

  images = [];

  constructor(dialogService, http, ea) {
    this.dialogService = dialogService;
    this.http = http;
    this.ea = ea;
  }

  activate() {
    this.loadPictures();
  }

  loadPictures() {
    //  load exiting pictures from server and add to images
   return this.http.fetch('pictures', {
        method: 'get'
      })
      .then(response => response.json())
      .then(body => {
        this.images = body;
      });
  }

  put(schedule) {
    return this.http.fetch('schedule/' + schedule.id, {
        method: 'put',
        body: json(schedule),
        'media-type': 'application/json'
      });
  }

  deletePicture(image) {
    this.dialogService.open({
      viewModel: Prompt,
      model: {
        question: 'Do you really want to delete this image?',
        title: 'Delete?'
      }
    }).then(response => {
      if (!response.wasCancelled) {
        this.delete(image);
      }
    });
  }

  delete(picture) {
    return this.http.fetch('pictures/'+picture.id, {
        method: 'delete',
        body: json(picture),
        'media-type': 'application/json'
      })
      .then(body => {
        this.loadPictures();
      });
  }
}
