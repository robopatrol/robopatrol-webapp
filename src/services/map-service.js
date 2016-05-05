import {inject} from 'aurelia-framework';
import {Ros, Service, ServiceRequest} from '../lib/ros';

@inject(Ros)
export class MapService {

  cachedOccupancyGrid = null;

  constructor(ros) {
    this.ros = ros;

    this.staticMapService= new Service({
      ros: this.ros,
      name : '/static_map',
      serviceType : 'nav_msgs/GetMap',
      compression : 'png'
    });

    this.request = new ServiceRequest();
  }

  getMap(force) {
    return new Promise((resolve, reject) => {
      if (this.cachedOccupancyGrid && !force) {
        return resolve(this.cachedOccupancyGrid);
      } else {
        this.staticMapService.callService(this.request, (response) => {
          this.cachedOccupancyGrid = response.map;
          resolve(this.cachedOccupancyGrid);
        });
      }
    });
  }
}
