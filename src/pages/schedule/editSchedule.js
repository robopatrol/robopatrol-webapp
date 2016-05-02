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
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
    Saturday: 5,
    Sunday: 6
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
    schedule.cron = schedule.second + ' ' +
      schedule.minute + ' ' +
      schedule.hour + ' * ' +
      schedule.month + ' ' +
      (schedule.day === '*' ? '*' : this.dayOfWeek[schedule.day]);

    delete schedule.second;
    delete schedule.minute;
    delete schedule.hour;
    delete schedule.day;
    delete schedule.month;
    this.controller.ok(schedule);
  }
}
