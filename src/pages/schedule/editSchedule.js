import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';

@inject(DialogController)
export class EditSchedule {

  schedule = {
    id: '',
    name: '',
    description: '',
    cron: ''
  };

  constructor(controller) {
    this.controller = controller;
  }
  activate(schedule) {
    this.schedule = schedule;
  }
}
