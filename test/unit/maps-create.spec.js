import {Create} from '../../src/pages/maps/create';

import {Ros} from '../../src/lib/ros';
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
    mockedRos = new Ros();
    mockedController = new ControllerStub();
    sut = new Create(mockedController, mockedMapService, mockedRos);
  });

  it('contains a title property', () => {
    expect(sut.title).toBeDefined();
  });

  it('configures the title property', () => {
    expect(sut.title).toEqual('Create new map');
  });

  it('contains a data property', () => {
    expect(sut.data).toBeDefined();
  });

  it('configures the speed property', () => {
    expect(sut.speed).toEqual(0.2);
  });

  it('configures the turn property', () => {
    expect(sut.turn).toEqual(0.5);
  });

  it('contains a ros property', () => {
    expect(sut.ros).toBeDefined();
  });

  it('configures the ros property', () => {
    expect(sut.ros).toEqual(mockedRos);
  });

  it('contains a controller property', () => {
    expect(sut.controller).toBeDefined();
  });

  it('configures the controller property', () => {
    expect(sut.controller).toEqual(mockedController);
  });

  it('contains a mapService property', () => {
    expect(sut.mapService).toBeDefined();
  });

  it('configures the mapService property', () => {
    expect(sut.mapService).toEqual(mockedMapService);
  });


  it('should define an action for each button', ()=>{
    expect(sut.buttons).toBeDefined();
    sut.buttons.forEach((row)=> {
      row.forEach((btn) => {
        expect(btn.action).toBeDefined();
        expect(btn.icon).toBeDefined();
      });
    });
  });

  it('moves forward', () => {
    spyOn(sut.cmdVel, 'publish');
    sut.speed = 5;

    sut.executeAction('forwards');

    expect(sut.twist.linear.x).toBe(5);
    expect(sut.twist.angular.z).toBe(0);
    expect(sut.cmdVel.publish).toHaveBeenCalled();
  });

  it('moves forward-left', () => {
    spyOn(sut.cmdVel, 'publish');
    sut.speed = 5;
    sut.turn = 8;

    sut.executeAction('forwards-left');

    expect(sut.twist.linear.x).toBe(5);
    expect(sut.twist.angular.z).toBe(8);
    expect(sut.cmdVel.publish).toHaveBeenCalled();
  });

  it('moves forward right', () => {
    spyOn(sut.cmdVel, 'publish');
    sut.speed = 5;
    sut.turn = 8;

    sut.executeAction('forwards-right');

    expect(sut.twist.linear.x).toBe(5);
    expect(sut.twist.angular.z).toBe(-8);
    expect(sut.cmdVel.publish).toHaveBeenCalled();
  });

  it('moves left', () => {
    spyOn(sut.cmdVel, 'publish');
    sut.turn = 5;

    sut.executeAction('left');

    expect(sut.twist.linear.x).toBe(0);
    expect(sut.twist.angular.z).toBe(5);
    expect(sut.cmdVel.publish).toHaveBeenCalled();
  });

  it('moves right', () => {
    spyOn(sut.cmdVel, 'publish');
    sut.turn = 5;

    sut.executeAction('right');

    expect(sut.twist.linear.x).toBe(0);
    expect(sut.twist.angular.z).toBe(-5);
    expect(sut.cmdVel.publish).toHaveBeenCalled();
  });

  it('stops', () => {
    spyOn(sut.cmdVel, 'publish');
    sut.speed = 5;

    sut.executeAction('stop');

    expect(sut.twist.linear.x).toBe(0);
    expect(sut.twist.angular.z).toBe(0);
    expect(sut.cmdVel.publish).toHaveBeenCalled();
  });

  it('moves backward', () => {
    spyOn(sut.cmdVel, 'publish');
    sut.speed = 5;

    sut.executeAction('backwards');

    expect(sut.twist.linear.x).toBe(-5);
    expect(sut.twist.angular.z).toBe(0);
    expect(sut.cmdVel.publish).toHaveBeenCalled();
  });

  it('moves backwards-left', () => {
    spyOn(sut.cmdVel, 'publish');
    sut.speed = 5;
    sut.turn = 8;

    sut.executeAction('backwards-left');

    expect(sut.twist.linear.x).toBe(-5);
    expect(sut.twist.angular.z).toBe(-8);
    expect(sut.cmdVel.publish).toHaveBeenCalled();
  });

  it('moves backwards-right', () => {
    spyOn(sut.cmdVel, 'publish');
    sut.speed = 5;
    sut.turn = 8;

    sut.executeAction('backwards-right');

    expect(sut.twist.linear.x).toBe(-5);
    expect(sut.twist.angular.z).toBe(8);
    expect(sut.cmdVel.publish).toHaveBeenCalled();
  });

  it('doesnt move by default', () => {
    spyOn(sut.cmdVel, 'publish');
    sut.speed = 5;
    sut.turn = 8;

    sut.executeAction('foo');

    expect(sut.twist.linear.x).toBe(0);
    expect(sut.twist.angular.z).toBe(0);
    expect(sut.cmdVel.publish).toHaveBeenCalled();
  });

  it('fetches the map', (done) => {
    sut.activate().then(() => {
      expect(sut.imageLayer).toBeDefined();
      done();
    });
  });

  it('can be deactivated', ()=>{
    spyOn(sut.mapService.poseTopic, 'unsubscribe');
    spyOn(sut.mapService.amclPoseTopic, 'unsubscribe');
    sut.deactivate();
    expect(sut.mapService.poseTopic.unsubscribe).toHaveBeenCalled();
    expect(sut.mapService.amclPoseTopic.unsubscribe).toHaveBeenCalled();
  });

  it('moves the bot to a pisition', ()=>{
    var latlng = {lat: 4, lng: 5};
    sut.moveTo(latlng);
    expect(sut.currentGoal).toBeDefined();
  });

  it('saves the map', ()=>{
    sut.data = {filename: 'test', name: 'A girl has no name'};
    spyOn(sut.mapService, 'saveMap').and.callThrough();

    sut.save();

    expect(sut.mapService.saveMap).toHaveBeenCalled();
    expect(sut.data.filename).toEqual('test.yaml');
  });

});
