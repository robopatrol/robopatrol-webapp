import {MapService, MapImage} from '../../src/services/map-service';
import {RosStub, ServiceStub} from './stubs/ros-stub';


describe('the map image', () => {
  var sut;

  beforeEach(() => {
    sut = new MapImage('base64', 1900, 1080, 0.3);
  });

  it('contains a data property', () => {
    expect(sut.data).toBeDefined();
  });

  it('contains a width property', () => {
    expect(sut.width).toBeDefined();
  });

  it('contains a height property', () => {
    expect(sut.height).toBeDefined();
  });

  it('contains a resolution property', () => {
    expect(sut.resolution).toBeDefined();
  });

  it('configures the data property', () => {
    expect(sut.data).toEqual('base64');
  });

  it('configures the width property', () => {
    expect(sut.width).toEqual(1900);
  });

  it('configures the height property', () => {
    expect(sut.height).toEqual(1080);
  });

  it('configures the resolution property', () => {
    expect(sut.resolution).toEqual(0.3);
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

  it('contains a static map service request property', () => {
    expect(sut.staticMapServiceRequest).toBeDefined();
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

  it('calls the ros service if no image is loaded', () => {
    spyOn(mockedService, 'callService');
    sut.getStaticMapImage();
    expect(mockedService.callService).toHaveBeenCalled();
  });

  it('skips the ros service call if image is already loaded', () => {
    sut.staticMapImage = 'is not null or undefined';
    spyOn(mockedService, 'callService');
    sut.getStaticMapImage();
    expect(mockedService.callService).not.toHaveBeenCalled();
  });

  it('calls the ros service if enforeced', () => {
    sut.staticMapImage = 'is not null or undefined';
    spyOn(mockedService, 'callService');
    sut.getStaticMapImage(true);
    expect(mockedService.callService).toHaveBeenCalled();
  });

});


describe('the map service grid convert function', () => {
  var sut;
  var msgInfo = { width: 4, height: 2, resolution: 0.5 };
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
