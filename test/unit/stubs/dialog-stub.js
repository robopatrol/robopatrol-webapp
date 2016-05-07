
export class DialogStub {

  response ={};

  open(params) {
    return new Promise((resolve, reject) => {
        return resolve(this.response);
    });
  }
}
