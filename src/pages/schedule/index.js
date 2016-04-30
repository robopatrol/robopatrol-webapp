import {inject} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {EditSchedule} from './editSchedule';

@inject(DialogService)
export class Schedule {

  entries = [];

  constructor(dialogService) {
    this.dialogService = dialogService;
  }

  activate() {
    this.loadSchedules();
  }

  loadSchedules() {
    // TODO load exiting schedules from server and add to entries
    //dummy entries
    this.entries = [{
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

  editSchedule(entry) {
    console.log("editing: ");
    console.log(entry);

    this.dialogService.open({
      viewModel: EditSchedule,
      model: entry
    }).then(response => {
      if (!response.wasCancelled) {
        console.log('good - ', response.output);
        //TODO  save changes to REST server
        //TODO if save not successful, refresh entries list
      }
    });

  }

  deleteSchedule(entry) {
    console.log("deleting:");
    console.log(entry);

    //TODO confirm deletion
    //TODO if confirmed, send delete to REST server, if not successful  refresh entries list
  }
}
