import {inject} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {EditPerson} from './editPerson';

export class Schedule {
  static inject = [DialogService];

  entries = [{
    id: 1,
    name: "Hourly Patrol",
    description: "This should keep the cats at bay!",
    cron: "0 * * * * "
  }, {
    id: 2,
    name: "Daily Patrol",
    description: "Make sure the dog doesn't do anything stupid",
    cron: "0 15 * * *"
  }];

  constructor(dialogService) {
    this.dialogService = dialogService;
  }

  person = { firstName: 'Wade', middleName: 'Owen', lastName: 'Watts' };
  submit(){
    this.dialogService.open({ viewModel: EditPerson, model: this.person}).then(response => {
      if (!response.wasCancelled) {
        console.log('good - ', response.output);
      } else {
        console.log('bad');
      }
      console.log(response.output);
    });
  }

  addEntry() {
    this.entries.push({id: -1, name: "", description: "", cron:""});
  }

}
