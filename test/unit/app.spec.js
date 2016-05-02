import {App, ConnectionStep} from '../../src/app';

import {RouterStub} from './stubs/router-stub'

describe('the App module', () => {
  var sut;
  var mockedRouter;

  beforeEach(() => {
    mockedRouter = new RouterStub();
    sut = new App();
    sut.configureRouter(mockedRouter, mockedRouter);
  });

  it('contains a router property', () => {
    expect(sut.router).toBeDefined();
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
