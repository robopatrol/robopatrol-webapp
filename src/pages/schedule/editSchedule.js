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

  dayOfWeek = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7
  };

  constructor(controller) {
    this.controller = controller;
  }
  activate(schedule) {
    if(schedule){
      this.title = "Edit schedule";
    } else {
      this.title = "Add schedule";
    }
    this.schedule = schedule;
  }

  convert(schedule){
    schedule.cron = schedule.minute + ' ' + schedule.hour + ' * * ' + ' ' + (schedule.day === '*' ? '*' : this.dayOfWeek[schedule.day]);
    delete schedule.minute;
    delete schedule.hour;
    delete schedule.day;
    this.controller.ok(schedule);
  }
}
