
export class RosStub {
  expectedUrl = 'ws://localhost:9090';
  isConnected = false;

  connect(url) {
    return new Promise((resolve, reject) => {
      if (url === this.expectedUrl) {
        this.isConnected = true;
        return resolve();
      } else {
        this.isConnected = false;
        return reject();
      }
    });
  }

  serviceIsRunning(serviceName) {
    return new Promise((resolve, reject) => {
      return resolve();
    });
  }
}

export class ServiceStub {

  response = {};

  callService(request, callback) {
    return callback(this.response);
  }
}
