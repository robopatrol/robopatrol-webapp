import {MapService, MapImage} from '../../src/services/map-service';
import {RosStub, ServiceStub} from './stubs/ros-stub';


describe('the map image', () => {
  var sut;
  var msgInfo = { width: 4, height: 2, resolution: 0.5, origin: { position: { x: 0, y: 0 }} };

  beforeEach(() => {
    sut = new MapImage(msgInfo, 'base64');
  });

  it('contains a data property', () => {
    expect(sut.data).toBeDefined();
  });

  it('contains a info property', () => {
    expect(sut.info).toBeDefined();
  });

  it('contains a bounds property', () => {
    expect(sut.bounds).toBeDefined();
  });

  it('configures the data property', () => {
    expect(sut.data).toEqual('base64');
  });

  it('configures the info property', () => {
    expect(sut.info).toEqual(msgInfo);
  });

  it('configures the bounds property', () => {
    expect(sut.bounds).toEqual(L.latLngBounds([0, 0], [1, 2]));
  });
});

describe('the map service module', () => {
  var sut;
  var mockedRos;
  var mockedService;

  beforeEach(() => {
    mockedRos = new RosStub();
    sut = new MapService(mockedRos);
  });

  it('contains a ros property', () => {
    expect(sut.ros).toBeDefined();
  });

  it('configures the ros property', () => {
    expect(sut.ros).toEqual(mockedRos);
  });

  it('contains a static map property', () => {
    expect(sut.staticMapImage).toBeDefined();
  });

  it('contains a static map service property', () => {
    expect(sut.staticMapService).toBeDefined();
  });
});

describe('the map service get static map function', () => {
  var sut;
  var mockedRos;
  var mockedService;

  beforeEach(() => {
    mockedRos = new RosStub();
    mockedService = new ServiceStub();
    sut = new MapService(mockedRos);
    sut.staticMapService = mockedService;
  });

  it('checks if the static_map service is available', (done) => {
    spyOn(mockedRos, 'serviceIsRunning');
    sut.getStaticMapImage().then(() => {
      expect(modckedRos.serviceIsRunning).toHaveBeenCalledWith('/static_map');
      done();
    }).catch(() => {
      done();
    });
  });

  it('calls the ros service if no image is loaded', (done) => {
    spyOn(mockedService, 'callService').and.callThrough();
    sut.getStaticMapImage().then(() => {
      expect(mockedService.callService).toHaveBeenCalled();
      done();
    }).catch(() => {
      done();
    });
  });

  it('skips the ros service call if image is already loaded', () => {
    sut.staticMapImage = 'is not null or undefined';
    spyOn(mockedService, 'callService').and.callThrough();
    sut.getStaticMapImage().then(() => {
      expect(mockedService.callService).not.toHaveBeenCalled();
      done();
    }).catch(() => {
      done();
    });
  });

  it('calls the ros service if enforeced', () => {
    sut.staticMapImage = 'is not null or undefined';
    spyOn(mockedService, 'callService').and.callThrough();
    sut.getStaticMapImage(true).then(() => {
      expect(mockedService.callService).toHaveBeenCalled();
      done();
    }).catch(() => {
      done();
    });
  });

});


describe('the map service grid convert function', () => {
  var sut;
  var msgInfo = { width: 4, height: 2, resolution: 0.5, origin: { position: { x: 0, y: 0 }} };
  var msgData = [100, 100, 100, 0, -1, -1, 0, 0];
  var image;

  beforeEach(() => {
    sut = new MapService();
    image = sut.convertOccupancyGridToMapImage({ info: msgInfo, data: msgData });
  });

  it('converts occupancy grid msg to base64 data', () => {
    expect(image.data.startsWith('data:image/png;base64'));
  });
});
