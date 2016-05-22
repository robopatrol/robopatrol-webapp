import {Disconnect} from '../../src/pages/disconnect';

describe('the disconnect module', () => {
  var sut;

  beforeEach(() => {
  var ros = {
    close: () => {
      return new Promise((reject, resolve) => {
        resolve('done');
      });
    }
  };
  var router = {
    navigate: (url) => {}
  };
  var ea = {};
  sut = new Disconnect(ros, router, ea);
});

  it('defines an url', () => {
    expect(sut).toBeDefined();
    expect(sut.url).toBe('localhost:9090');
    expect(sut.ros).toBeDefined();
    expect(sut.router).toBeDefined();
    expect(sut.ea).toBeDefined();
  });

  it('closes the connection', () => {
    spyOn(sut.ros, 'close').and.callThrough();

    sut.activate();

    expect(sut.ros.close).toHaveBeenCalled();
  });
});
