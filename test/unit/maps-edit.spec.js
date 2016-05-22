import {Edit} from '../../src/pages/maps/edit';

import {RosStub} from './stubs/ros-stub';
import {MapServiceStub} from './stubs/map-service-stub';

class ControllerStub {
  ok(result) {
    this.result = result;
  }
}

describe('the map create module', () => {
  var sut;
  var mockedMapService;
  var mockedRos;
  var mockedController;

  beforeEach(() => {
    mockedMapService = new MapServiceStub();
    mockedRos = new RosStub();
    mockedController = new ControllerStub();
    sut = new Edit(mockedController, mockedMapService, mockedRos);
  });

  it('contains a title property', () => {
    expect(sut.title).toBeDefined();
  });

  it('configures the title property', () => {
    expect(sut.title).toEqual('Set robot position');
  });

  it('contains a initial pose topic', () => {
    expect(sut.initialPoseTopic).toBeDefined();
  });
});
