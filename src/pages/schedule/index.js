export class Schedule {
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

  addEntry() {
    console.log("foobar");
    this.entries.push({id: -1, name: "", description: "", cron:""});
  }

}
