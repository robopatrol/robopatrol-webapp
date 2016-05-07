import {inject} from 'aurelia-framework';
import {Ros, Service, ServiceRequest} from '../lib/ros';


export class MapImage {

  constructor(data, width, height, resolution) {
    this.data = data;
    this.width = width;
    this.height = height;
    this.resolution = resolution;
  }
}

@inject(Ros)
export class MapService {

  staticMapImage = null;

  constructor(ros) {
    this.ros = ros;

    this.staticMapService = new Service({
      ros: this.ros,
      name : '/static_map',
      serviceType : 'nav_msgs/GetMap',
      compression : 'png'
    });

    this.staticMapServiceRequest = new ServiceRequest();
  }

  getStaticMapImage(force) {
    return new Promise((resolve, reject) => {
      if (this.staticMapImage && !force) {
        return resolve(this.staticMapImage);
      } else {
        this.staticMapService.callService(this.staticMapServiceRequest, (response) => {
          this.staticMapImage = this.convertOccupancyGridToMapImage(response.map);
          return resolve(this.staticMapImage);
        });
      }
    });
  }

  convertOccupancyGridToMapImage(occupancyGridMsg) {
    let resolution = occupancyGridMsg.info.resolution;
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

    return new MapImage(canvas.toDataURL("image/png"), width, height, resolution);
  }
}
