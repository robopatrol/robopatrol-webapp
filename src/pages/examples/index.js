
export class Examples {
  configureRouter(config, router) {
    config.map([
      { route: '', redirect: 'map-navigation' },
      { route: 'rest', name: 'rest', moduleId: './rest/index', nav: true, title: 'REST API' },
      { route: 'map-navigation', name: 'map-navigation', moduleId: './map-navigation', nav: true, title: 'Map Navigation' },
      { route: 'dummy-move', name: 'dummy-move', moduleId: './dummy-move', nav: true, title: 'Dummy Move' }
    ]);

    this.router = router;
  }
}
