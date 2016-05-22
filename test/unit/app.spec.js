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
    expect(sut.router.routes).toContain({ route: ['', 'home'], name: 'home', moduleId: 'pages/home', nav: true, title: 'Home', connected: true, settings: { startpage: false, last: false, enable: true, icon: '/img/page/home.png' } });
  });

  it('should have a connect route', () => {
    expect(sut.router.routes).toContain({ route: 'connect', name: 'connect', moduleId: 'pages/connect', nav: false, title: 'Connect', connected: false, settings: { startpage: false, last: false, enable: false, icon: '' } });
  });

  it('should have a disconnect route', () => {
    expect(sut.router.routes).toContain({ route: 'disconnect', name: 'disconnect', moduleId: 'pages/disconnect', nav: true, title: 'Disconnect', connected: true, settings: { startpage: false, last: false, enable: false, icon: '' } });
  });

  it('should have a schedule route', () => {
    expect(sut.router.routes).toContain({ route: 'schedule', name: 'schedule', moduleId: 'pages/schedule/index', nav: true, title: 'Schedule patrol', connected: true, settings: { startpage: true, last: false, enable: true, icon: '/img/page/route.png' } });
  });

  it('should have a battery route', () => {
    expect(sut.router.routes).toContain({ route: 'battery', name: 'battery', moduleId: 'pages/ros-infos/battery', nav: true, title: 'Battery status', connected: true, settings: { startpage: true, last: false, enable: false, icon: '/img/page/battery.png' } });
  });

  it('should have a images route', () => {
    expect(sut.router.routes).toContain({ route: 'images', name: 'images', moduleId: 'pages/images', nav: true, title: 'Images', connected: true, settings: { startpage: true, last: true, enable: true, icon: '/img/page/picture.png' } });
  });

  it('should have a warnings route', () => {
    expect(sut.router.routes).toContain({ route: 'warnings', name: 'warnings', moduleId: 'pages/warnings', nav: true, title: 'Status', connected: true, settings: { startpage: true, last: true, enable: false, icon: '/img/page/warning.png' } });
  });

  it('should have a settings route', () => {
    expect(sut.router.routes).toContain({ route: 'settings', name: 'settings', moduleId: 'pages/settings', nav: true, title: 'Settings', connected: true, settings: { startpage: true, last: false, enable: false, icon: '/img/page/settings.png' } });
  });

  it('should have a teleop route', () => {
    expect(sut.router.routes).toContain({ route: 'teleop', name: 'teleop', moduleId: 'pages/teleop/index', nav: true, title: 'Manual driving', connected: true, settings: { startpage: true, last: false, enable: true, icon: '/img/page/manual.png' } });
  });

  it('should have a ros-infos route', () => {
    expect(sut.router.routes).toContain({ route: 'ros-infos', name: 'ros-infos', moduleId: 'pages/ros-infos/index', nav: true, title: 'ROS Infos', connected: true, settings: { startpage: true, last: false, enable: true, icon: '/img/page/info.png' } });
  });
  
});
