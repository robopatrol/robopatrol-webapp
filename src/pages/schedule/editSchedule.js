import {inject, bindable} from 'aurelia-framework';
import {MapService} from '../../services/map-service';
import {DialogController} from 'aurelia-dialog';
import {Waypoint} from './waypoint';
import {Schedule} from './index';

@inject(MapService, DialogController)
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
  
  editLayer = null;
  
  waypoints = [];
  
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
    this.map = L.map('map', {
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

  convert(schedule){
    var time = schedule.time.split(":");
    schedule.hour = time[0];
    schedule.minute = time[1];
    
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
    
  createWaypoint() {
    this.editLayer = this.map.editTools.startPolyline();
  }

  save() {
    if (this.editLayer) {
      this.editLayer.getLatLngs().forEach( (point)=> {
        // Lat (Latitude) means North/Sourth = y ; Lng (Longitude) means Ease/West = x
        var waypoint = new Waypoint("", "", point.lng, point.lat);
        this.waypoints.push(waypoint);
        Schedule.prototype.postRoute(waypoint);
      });
    }
  }
  
  load() {
    // TODO get waypoints from REST
    let latLngs = [];
    this.waypoints.forEach( (point)=> {
      latLngs.push(L.latLng(point.y, point.x));
    });
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
}