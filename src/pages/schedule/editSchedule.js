import {inject, bindable} from 'aurelia-framework';
import {MapService} from '../../services/map-service';
import {DialogController} from 'aurelia-dialog';


@inject(MapService, DialogController)
export class EditSchedule {

  editLayer = null;
  
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

  constructor(mapService, controller) {
    this.mapService = mapService;
    this.controller = controller;
  }

  activate(schedule) {
    // return promise to delay view activiation until map data is loaded
    return new Promise((resolve, reject) => {
      this.mapService.getStaticMapImage().then((image) => {

        // create a leaflet image layer with base64 encoded data
        this.imageLayer = L.imageOverlay(image.data, image.bounds);

        return resolve();
      }).catch(() => {
        console.warn("Loading map data failed.")
        return reject()
      });
    });
    
    if(schedule){
      this.title = "Edit schedule";
    } else {
      this.title = "Add schedule";
    }
    this.schedule = schedule;
  }

  attached() {
    // create leaflet map after dom is ready
    this.map = L.map('maptest', {
      crs: L.CRS.Simple,
      editable: true
    });

    this.map.addLayer(this.imageLayer);

    // zoom map to image extent
    this.map.fitBounds(this.imageLayer.getBounds());
  }

  deactivate() {
    this.map.editTools.stopDrawing();
  }

  createWaypoint() {
    //this.clean();
    this.editLayer = this.map.editTools.startPolyline();
  }

  createBorder() {
    //this.clean();
    this.editLayer = this.map.editTools.startPolyline();
    this.editLayer.setStyle({color:'red'});
  }

  save() {
    if (this.editLayer && !this.map.editTools.drawing()) {
      // save data xy = array of y,x values
      alert("Save: " + this.editLayer.getLatLngs());
      this.editLayer.disableEdit();
    }
  }

  show() {
    // create random path
    let bounds = this.imageLayer.getBounds();
    let xMax = Math.abs(bounds.getEast()) + Math.abs(bounds.getWest());
    let yMax = Math.abs(bounds.getNorth()) + Math.abs(bounds.getSouth());
    let latLngs = [];

    for (let i = 0; i < 7; i++) {
      let x = Math.random() * xMax - Math.abs(bounds.getWest());
      let y = Math.random() * yMax - Math.abs(bounds.getSouth());
      // Lat (Latitude) means North/Sourth = y ; Lng (Longitude) means Ease/West = x
      latLngs.push(L.latLng(y, x));
    }

    this.clean();
    this.editLayer = L.polyline(latLngs).addTo(this.map);
  }

  edit() {
    if (this.editLayer && !this.editLayer.editEnabled()) {
      this.editLayer.enableEdit();
    }
  }

  clean() {
    this.map.editTools.stopDrawing();
    if (this.editLayer) {
      this.map.removeLayer(this.editLayer);
      this.editLayer = null;
    }
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
