import {inject} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {EditSchedule} from './editSchedule';

@inject(DialogService)
export class Schedule {

  //dummy entries
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
    // TODO load exiting schedules from server and add to entries
  }

  addSchedule() {
    this.dialogService.open({
      viewModel: EditSchedule
    }).then(response => {
      if (!response.wasCancelled) {
        console.log('good - ', response.output);
        //TODO save new schedule via REST, only add to entries (see line below) if save was successful
        this.entries.push({
          id: '', //should be assigned by server
          name: response.output.name,
          description: response.output.description,
          cron: response.output.cron
        });
      }
    });
  }
}
