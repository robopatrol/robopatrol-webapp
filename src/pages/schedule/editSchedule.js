import {inject, bindable} from 'aurelia-framework';
import {MapService} from '../../services/map-service';
import {DialogController} from 'aurelia-dialog';
import {HttpClient, json} from 'aurelia-fetch-client';
//import {Waypoint} from './waypoint';
//import {Schedule} from './index';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(MapService, DialogController, HttpClient)
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
  
  waypoint = {
    id: '',
    name: '',
    x: 0,
    y: 0
  };
  
  waypoints = [];
  
  editLayer = null;
  
  constructor(mapService, controller, http) {
    this.mapService = mapService;
    this.controller = controller;
    this.http = http;
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
    
    
    
    
    
    
    
    
    
 
    
  
  load() {
    this.getWaypoints();
    let latLngs = [];
    this.waypoints.forEach( (point)=> {
      var name = point.name.split("#");
      if (name[0] == this.schedule.name) {
        latLngs.push(L.latLng(point.y, point.x));
      }
    });
    this.clean();
    this.editLayer = L.polyline(latLngs).addTo(this.map);
  }
  
  create() {
    this.editLayer = this.map.editTools.startPolyline();
  }
  
  edit() {
    if (this.editLayer && !this.editLayer.editEnabled()) {
      this.editLayer.enableEdit();
    }
  }
  
  save() {
    if (this.editLayer) {

//      this.waypoints.forEach( (point)=> {
//        var name = point.name.split("#");
//        if (name[0] == this.schedule.name) {
//          this.deleteWaypoints(point);
//        }
//      });

      var idx = 1;
      this.editLayer.getLatLngs().forEach( (point)=> {
        this.waypoint.name = this.schedule.name + "#" + idx++;
        // Lat (Latitude) means North/Sourth = y ; Lng (Longitude) means Ease/West = x
        this.waypoint.x = point.lng;
        this.waypoint.y = point.lat;
        this.postWaypoint(this.waypoint);
      });
    }
  } 

  clean() {
    this.map.editTools.stopDrawing();
    if (this.editLayer) {
      this.map.removeLayer(this.editLayer);
      this.editLayer = null;
    }
    
//    this.waypoints.forEach( (point)=> {
//      var name = point.name.split("#");
//      if (name[0] == this.schedule.name) {
//        this.deleteWaypoints(point);
//      }
//    });
  } 
  
  getWaypoints() {
    this.http.fetch('route', {
      method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
      data.sort(function(a, b) {
        var nameA = a.name;
        var nameB = b.name;
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        // names must be equal
        return 0;
      });
      this.waypoints = data;
    });
  }

  postWaypoint(waypoint) {
    this.http.fetch('route', {
      method: 'post',
      body: json(waypoint),
      'media-type': 'application/json'
    })
    .then(response => response.json())
    .then(data => {
      this.waypoints.push(data);
      console.log(this.waypoints);
    });
  }

  deleteWaypoints(waypoint) {
    this.http.fetch('route/'+waypoint.id, {
        method: 'delete',
        body: json(waypoint),
        'media-type': 'application/json'
      })
      .then(body => {
        console.log(body);
//        this.getWaypoints();
      });
  } 
}