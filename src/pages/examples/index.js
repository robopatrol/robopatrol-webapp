
export class Examples {
  configureRouter(config, router) {
    config.map([
      { route: '', redirect: 'leaflet-ros' },
      { route: 'rest', name: 'rest', moduleId: './rest/index', nav: true, title: 'REST API' },
      { route: 'map-navigation', name: 'map-navigation', moduleId: './map-navigation', nav: true, title: 'Map Navigation' },
      { route: 'leaflet-ros', name: 'leaflet-ros', moduleId: './leaflet-ros', nav: true, title: 'Leaflet & Ros' },
      { route: 'dummy-move', name: 'dummy-move', moduleId: './dummy-move', nav: true, title: 'Dummy Move' }
    ]);

    this.router = router;
  }
}
