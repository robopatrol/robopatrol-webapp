import {RosStub} from './stubs/ros-stub';
import {MapService} from '../../src/services/map-service';
import {EditSchedule} from '../../src/pages/schedule/editSchedule';
import {HttpStub} from './stubs/http-stub';

export class ControllerStub {
  ok(result) {
    this.result = result;
  }
}

describe('the edit schedule dialog', () => {
  var sut;
  var controller;
  var mockedRos;
  var mockedMapService;
  var mockedHttp;
  var point1;
  var point2;
  var point3;
  var point4;

  beforeEach(() => {
    mockedRos = new RosStub();
    mockedMapService = new MapService(mockedRos);
    controller = new ControllerStub();
    mockedHttp = new HttpStub();
    sut = new EditSchedule(mockedMapService, controller, mockedHttp);
    
    // init routes
    point1 = {id:1, name:'first Route#1', x: 2.2, y: 3.0};
    point2 = {id:2, name:'first Route#2', x: 2.2, y: 3.0};
    point3 = {id:3, name:'second Route#1', x: 2.2, y: 3.0};
    point4 = {id:4, name:'second Route#2', x: 2.2, y: 3.0};
    sut.waypoints.push(point2);
    sut.waypoints.push(point4);
    sut.waypoints.push(point1);
    sut.waypoints.push(point3);  
  });
  
  afterEach(() => {
    point1 = null;
    point2 = null;
    point3 = null;
    point4 = null;
    sut.waypoints = null;
    sut.currentRoute = null;
    
    mockedRos = null;
    mockedMapService = null;
    controller = null;
    mockedHttp = null;
    sut = null;
  });
  
  it('sets the title', () => {
    sut.activate();
    expect(sut.title).toBe("Add schedule");
  });

  it('sets the title', () => {
    sut.activate({
      id: 1
    });
    expect(sut.title).toBe("Edit schedule");
  });

  it('converts the input to a cron string', () => {
    var schedule = {
      second: 1,
      minute: 2,
      hour: 3,
      day: 'Friday',
      month: 5
    };
    sut.convert(schedule);
    expect(controller.result.cron).toBe('1 2 3 * 5 4');
    expect(controller.result.second).not.toBeDefined();
    expect(controller.result.minute).not.toBeDefined();
    expect(controller.result.hour).not.toBeDefined();
    expect(controller.result.day).not.toBeDefined();
    expect(controller.result.month).not.toBeDefined();
  });

  it('converts the input to a cron string with day not set', () => {
    var schedule = {
      second: 1,
      minute: 2,
      hour: 3,
      day: '*',
      month: 5
    };
    sut.convert(schedule);
    expect(controller.result.cron).toBe('1 2 3 * 5 *');
    expect(controller.result.second).not.toBeDefined();
    expect(controller.result.minute).not.toBeDefined();
    expect(controller.result.hour).not.toBeDefined();
    expect(controller.result.day).not.toBeDefined();
    expect(controller.result.month).not.toBeDefined();
  });
  
  it('all events are defined', () => {
    expect(sut.load).toBeDefined();
    expect(sut.create).toBeDefined();
    expect(sut.edit).toBeDefined();
    expect(sut.save).toBeDefined();
    expect(sut.clean).toBeDefined();
  });
  
  it('load route for current schedule', () => {
    spyOn(sut, 'get').and.callThrough();    
    var currentSchedule = {id:1, name:'no Route', description: '', cron: ''};
    sut.load(currentSchedule);

    Promise.resolve('done').then(function() {
      expect(sut.get).toHaveBeenCalled();
      done();
    });
    
    spyOn(sut, 'clearRoute');
    sut.load(currentSchedule);
    expect(sut.clearRoute).not.toHaveBeenCalled();
  });
  
  it('save a waypoint', () => {
    spyOn(sut, 'delete').and.callThrough();    
    sut.save();

    Promise.resolve('done').then(function() {
      expect(sut.delete).toHaveBeenCalled();
      expect(sut.delete).toHaveBeenCalledWith(point1.id);
      expect(sut.delete).toHaveBeenCalledWith(point2.id);
      expect(sut.delete).not.toHaveBeenCalledWith(point3.id);
      done();
    });
    
    spyOn(sut, 'post').and.callThrough();    
    sut.save();

    Promise.resolve('done').then(function() {
      expect(sut.post).toHaveBeenCalled();
      expect(sut.post).toHaveBeenCalledWith(point1.id);
      expect(sut.post).toHaveBeenCalledWith(point2.id);
      expect(sut.post).not.toHaveBeenCalledWith(point3.id);
      done();
    });
  });
  
  it('create, edit and clear the route layer', () => {
    expect(sut.editLayer).toBe(null);
    expect(sut.create).toBeDefined();
    expect(sut.edit).toBeDefined();
    expect(sut.clean).toBeDefined();
  });
  
  it('sort the waypoints by route name', () => {
    expect(sut.waypoints[0].name).not.toEqual('first Route#1');
    sut.sort(sut.waypoints);
    expect(sut.waypoints[0].name).toEqual('first Route#1');
  });
  
  it('get waypoints by route name', () => {
    expect(sut.waypoints.length).toEqual(4);
    expect(sut.currentRoute.length).toEqual(0);
    sut.getCurrentRoute(sut.waypoints, 'first Route')
    expect(sut.currentRoute.length).toEqual(2);
    expect(sut.currentRoute[0].name).toEqual('first Route#2');
  });
});
