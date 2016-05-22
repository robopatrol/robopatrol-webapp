
export class MapServiceStub {

  poseTopic = {
    unsubscribe: () => {},
    subscribe: () => {}
  };
  amclPoseTopic = {
    unsubscribe: () => {},
    subscribe: () => {}
  }

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

  getStaticMapImage(){
    return new Promise((resolve, reject) => {
      return resolve({success:true});
    });
  }

  getDynamicMapImage(){
    return new Promise((resolve, reject) => {
      return resolve({success:true});
    });
  }

  saveMap(){
    return new Promise((resolve, reject) => {
      return resolve({success:true});
    });
  }
}
