import {App, ConnectionStep} from '../../src/app';

import {RouterStub} from './stubs/router-stub'
import {RosStub} from './stubs/ros-stub'

describe('the App module', () => {
  var sut;
  var mockedRouter;
  var mockedRos;

  beforeEach(() => {
    mockedRouter = new RouterStub();
    mockedRos = new RosStub();
    sut = new App(mockedRos);
    sut.configureRouter(mockedRouter, mockedRouter);
  });

  it('contains a router property', () => {
    expect(sut.router).toBeDefined();
  });

  it('contains a ros property', () => {
    expect(sut.ros).toBeDefined();
  });

  it('configures the router title', () => {
    expect(sut.router.title).toEqual('Robopatrol');
  });

  it('should have a home route', () => {
    expect(sut.router.routes).toContain({ route: ['', 'home'], name: 'home', moduleId: 'pages/home', nav: true, title: 'Home', connected: true });
  });

  it('should have a connect route', () => {
    expect(sut.router.routes).toContain({ route: 'connect', name: 'connect', moduleId: 'pages/connect', nav: false, title: 'Connect', connected: false });
  });

  it('should have a disconnect route', () => {
    expect(sut.router.routes).toContain({ route: 'disconnect', name: 'disconnect', moduleId: 'pages/disconnect', nav: true, title: 'Disconnect', connected: true });
  });
});
