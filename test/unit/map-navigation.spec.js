import {RosStub} from './stubs/ros-stub'
import {Point} from '../../src/pages/waypoint/point';
import {MapNavigation} from '../../src/pages/waypoint/map-navigation';

describe('the map-navigation module', () => {
  var mockedRos;
  var point;
  var mapNavigation;
  var waypoints;
  var borderpoints;
  var canvas;
  var event;
  var xPos, yPos;

  beforeEach(() => {
    waypoints = [];
    borderpoints = [];
    mockedRos = new RosStub();
    point = new Point()
    mapNavigation = new MapNavigation(mockedRos, point, waypoints, borderpoints);
    
    canvas = document.createElement('canvas');
    event = document.createEvent('MouseEvents');
    xPos = 80;
    yPos = 20;
    event.initMouseEvent('click', true, true, window, 0, 0, 0, xPos, yPos, false, false, false, false, 0, null);
  });

  it('gets mouse position', () => {
    var pos = mapNavigation.getMousePos(canvas, event);
    expect(pos.x).toEqual(xPos);
    expect(pos.y).toEqual(yPos);
  });

   it('shows the map', () => {
    //var map = document.querySelector("canvas");
    expect(document.querySelector("canvas")).toBeDefined();
  });
  
  it('sets and delete a waypoint', () => {
    expect(waypoints.length).toBe(0);
    mapNavigation.setWaypoint(event, canvas);
    expect(waypoints.length).toBe(1);
    
    expect(waypoints[0]).toEqual(new Point(xPos,yPos));
    
    mapNavigation.deleteWaypoint(event, canvas);
    expect(waypoints.length).toBe(0);
  });
  
  it('sets and delete a borderpoint', () => {
    expect(borderpoints.length).toBe(0);
    mapNavigation.setBorderpoint(event, canvas);
    expect(borderpoints.length).toBe(1);
    
    expect(borderpoints[0]).toEqual(new Point(xPos,yPos));
    
    mapNavigation.deleteBorderpoint(event, canvas);
    expect(borderpoints.length).toBe(0);
  });
  
  it('draws into canvas', () => {
    expect(mapNavigation.draw).toBeDefined();
  });
  
  it('saves the patrol', () => {
  	document.getElementById("savePatrol").click();
    expect(mapNavigation.patrolSaved).toBe(false);
  });
});

