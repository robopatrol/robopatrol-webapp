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

  it('fetches the image', (done)=>{
    sut.activate().then(()=>{
      expect(sut.imageLayer).toBeDefined();
      done();
    });
  });

  it('can be deactivated', () => {
    sut.deactivate();
  });

  it('updates the pattern', () => {
    window.L.Symbol = jasmine.createSpyObj('Symbol', ['arrowHead']);
    sut.arrowHead = jasmine.createSpyObj('arrowHead', ['setPatterns'])
    sut.updatePattern();
    expect(sut.arrowHead.setPatterns).toHaveBeenCalled();
  });

  it('doesnt saves the map if arrowLayer is undefined', ()=>{
    sut.arrowLayer = null;
    sut.save();
  });

  it('saves the map', ()=>{
    sut.arrowLayer = {getLatLngs: ()=>{
      return [{lat: 0, lng:0.2}, {lat: 0.1, lng: 0.3}];
    }};
    spyOn(sut.initialPoseTopic, 'publish');
    spyOn(sut.controller, 'ok');

    sut.save();

    expect(sut.initialPoseTopic.publish).toHaveBeenCalled();
    expect(sut.controller.ok).toHaveBeenCalled();
  });

  

});
