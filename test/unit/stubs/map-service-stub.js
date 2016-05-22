
export class MapServiceStub {

  startMapServer(filename) {
    return new Promise((resolve, reject) => {
      return resolve({sucess: true});
    });
  }

  startMapRecording() {
    return new Promise((resolve, reject) => {
      return resolve({sucess: true});
    });
  }

  deleteMap(id) {
    return new Promise((resolve, reject) => {
      return resolve({sucess: true});
    });
  }
}
