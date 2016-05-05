import {MapService, MapImage} from '../../src/services/map-service';
import {RosStub} from './stubs/ros-stub';


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
  var mokedRos;

  beforeEach(() => {
    mokedRos = new RosStub();
    sut = new MapService();
  });
});
