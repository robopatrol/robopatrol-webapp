import {inject} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {EditSchedule} from './editSchedule';
import {Prompt} from './prompt';
import {HttpClient, json} from 'aurelia-fetch-client';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(DialogService, HttpClient, EventAggregator)
export class Schedule {

  entries = [];

  constructor(dialogService, http, ea) {
    this.dialogService = dialogService;
    this.http = http;
    this.ea = ea;
  }

  activate() {
    this.loadSchedules();
  }

  loadSchedules() {
    //  load exiting schedules from server and add to entries
   return this.http.fetch('schedule', {
        method: 'get'
      })
      .then(response => response.json())
      .then(body => {
        this.entries = body;
      });
  }

  addSchedule() {
    this.dialogService.open({
      viewModel: EditSchedule
    }).then(response => {
      if (!response.wasCancelled) {
        this.post(response.output);
      }
    });
  }

  post(schedule) {
    return this.http.fetch('schedule', {
        method: 'post',
        body: json(schedule),
        'media-type': 'application/json'
      })
      .then(response => response.json())
      .then(body => {
        this.entries.push({
          id: body.id,
          name: body.name,
          description: body.description,
          cron: body.cron
        });
      });
  }

  editSchedule(entry) {
    this.dialogService.open({
      viewModel: EditSchedule,
      model: entry
    }).then(response => {
      if (!response.wasCancelled) {
        this.put(entry);
      } else {
        this.loadSchedules();
      }
    });
  }

  put(schedule) {
    return this.http.fetch('schedule/' + schedule.id, {
        method: 'put',
        body: json(schedule),
        'media-type': 'application/json'
      });
  }

  deleteSchedule(entry) {
    this.dialogService.open({
      viewModel: Prompt,
      model: {
        question: 'Do you really want to delete this schedule?',
        title: 'Delete?'
      }
    }).then(response => {
      if (!response.wasCancelled) {
        this.delete(entry);
      }
    });
  }

  delete(schedule) {
    return this.http.fetch('schedule/'+schedule.id, {
        method: 'delete',
        body: json(schedule),
        'media-type': 'application/json'
      })
      .then(body => {
        this.loadSchedules();
      });
  }
}
