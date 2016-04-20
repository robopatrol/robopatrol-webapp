
export class Ros extends ROSLIB.Ros {

  connect(url) {
    return new Promise((resolve, reject) => {
      this.once('connection', function() {
         return resolve();
      });
      this.once('error', function(error) {
         return reject(error);
      });
      super.connect(url);
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.once('close', function() {
        return resolve();
      });
      super.close();
    });
  }

  getNodes() {
    return new Promise((resolve, reject) => {
      super.getNodes(resolve, reject);
    });
  }

  getParams() {
    return new Promise((resolve, reject) => {
      super.getParams(resolve, reject);
    });
  }

  getServices() {
    return new Promise((resolve, reject) => {
      super.getServices(resolve, reject);
    });
  }

  getTopics() {
    return new Promise((resolve, reject) => {
      super.getTopics(resolve, reject);
    });
  }
}

export class Topic extends ROSLIB.Topic {}

export class Message extends ROSLIB.Message {}

export class Service extends ROSLIB.Service {}

export class ServiceRequest extends ROSLIB.ServiceRequest {}
