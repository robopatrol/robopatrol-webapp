import {Connect} from '../../src/pages/connect';

import {RosStub} from './stubs/ros-stub';
import {RouterStub} from './stubs/router-stub';
import {HttpStub} from './stubs/http-stub';
import {EventAggregator} from './stubs/event-aggregator-stub';


describe('the connect module', () => {
  var sut;
  var mockedRos;
  var mockedRouter;
  var mockedHttp;
  var mockedEa;

  beforeEach(() => {
    mockedRos = new RosStub();
    mockedRouter = new RouterStub();
    mockedHttp = new HttpStub();
    mockedEa = new EventAggregator();
    sut = new Connect(mockedRos, mockedRouter, mockedHttp, mockedEa);
  });

  it('contains a heading', () => {
    expect(sut.heading).toBeDefined();
  });

  it('contains a websocket url', () => {
    expect(sut.wsUrl).toBeDefined();
  });

  it('contains a rest server url', () => {
    expect(sut.restUrl).toBeDefined();
  });

  it('contains a nextRoute property', () => {
    expect(sut.nextRoute).toBeDefined();
  });

  it('contains a autoconnect flag', () => {
    expect(sut.autoConnect).toBeDefined();
  });

  it('contains a ros property', () => {
    expect(sut.ros).toBeDefined();
  });

  it('contains a router property', () => {
    expect(sut.router).toBeDefined();
  });

  it('contains a http property', () => {
    expect(sut.http).toBeDefined();
  });

  it('contains a ea property', () => {
    expect(sut.ea).toBeDefined();
  });

  it('configures the heading', () => {
    expect(sut.heading).toEqual('Connect to Robopatrol');
  });

  it('configures the default websocket url', () => {
    expect(sut.wsUrl).toEqual('localhost:9090');
  });

  it('configures the default rest server url', () => {
    expect(sut.restUrl).toEqual('localhost:9998');
  });

  it('configures the auto connect flag', () => {
    expect(sut.autoConnect).toEqual(true);
  });

  it('configures the next route', () => {
    expect(sut.nextRoute).toEqual('/');
  });

  it('updates the next route on activation', () => {
    sut.autoConnect = false;
    sut.activate({came_from: 'hell'});
    expect(sut.nextRoute).toEqual('hell');
  });

  it('tries to auto connect on activation', () => {
    spyOn(sut, 'submit');
    sut.activate({});
    expect(sut.submit).toHaveBeenCalled();
  });

  it('connects on form submit', () => {
    sut.submit();
    expect(sut.ros.isConnected).toEqual(true);
  });
});
