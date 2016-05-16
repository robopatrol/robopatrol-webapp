import {inject} from 'aurelia-framework';
import {Ros, Service, ServiceRequest} from '../lib/ros';


export class MapImage {

  constructor(info, data) {
    this.info = info;
    this.data = data;
    this.bounds = L.latLngBounds([
      [info.origin.position.y, info.origin.position.x],
      [info.origin.position.y + info.height * info.resolution, info.origin.position.x + info.width * info.resolution]
    ]);
  }
}

@inject(Ros)
export class MapService {

  staticMapImage = null;

  constructor(ros) {
    this.ros = ros;

    this.mapServiceStart = new Service({
      ros: this.ros,
      name: '/robopatrol/map_service/start',
      serviceType: 'robopatrol/MapServiceStart'
    });
    this.mapServiceStop = new Service({
      ros: this.ros,
      name: '/robopatrol/map_service/stop',
      serviceType: 'robopatrol/MapServiceStop'
    });

    this.staticMapService = new Service({
      ros: this.ros,
      name : '/static_map',
      serviceType : 'nav_msgs/GetMap',
      compression : 'png'
    });
  }

  startMapServer(filename) {
    return new Promise((resolve, reject) => {
      let request = new ServiceRequest({
        filename: filename
      });
      this.mapServiceStart.callService(request, (response) => {
        if (response.success) {
          this.getStaticMapImage(true).then(() => {
            return resolve(response);
          });
        } else {
          return reject(response);
        }
      });
    });
  }

  getStaticMapImage(force) {
    return new Promise((resolve, reject) => {
      if (this.staticMapImage && !force) {
        return resolve(this.staticMapImage);
      } else {
        let request = new ServiceRequest();
        this.ros.serviceIsRunning('/static_map')
          .then(() => {
            this.staticMapService.callService(request, (response) => {
              this.staticMapImage = this.convertOccupancyGridToMapImage(response.map);
              return resolve(this.staticMapImage);
            });
          })
          .catch(() => {
            return reject();
          });
      }
    });
  }

  convertOccupancyGridToMapImage(occupancyGridMsg) {
    let width = occupancyGridMsg.info.width;
    let height = occupancyGridMsg.info.height;
    let maxValue = 100;
    let canvas = document.createElement('canvas');
    let ctx, imageData;

    canvas.width = width;
    canvas.height = height;

    ctx = canvas.getContext('2d');
    imageData = ctx.createImageData(width, height);

    occupancyGridMsg.data.forEach((value, index) => {
      let x = (index % width);
      let y = height - Math.floor(index / width);
      var i = (x + (y * width)) * 4;

      if (value < 0) {
        value = 127;
      } else {
        value = (maxValue - value) / maxValue * 255;
      }

      // red
      imageData.data[i] = value;
      // green
      imageData.data[++i] = value;
      // blue
      imageData.data[++i] = value;
      // alpha
      imageData.data[++i] = 255;

    });

    ctx.putImageData(imageData, 0, 0);

    return new MapImage(occupancyGridMsg.info, canvas.toDataURL("image/png"));
  }
}
