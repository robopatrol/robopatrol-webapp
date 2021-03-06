
export class Examples {
  configureRouter(config, router) {
    config.map([
      { route: '', redirect: 'leaflet-ros' },
      { route: 'map-navigation', name: 'map-navigation', moduleId: './map-navigation', nav: true, title: 'Map Navigation' },
      { route: 'leaflet-ros', name: 'leaflet-ros', moduleId: './leaflet-ros', nav: true, title: 'Leaflet & Ros' },
      { route: 'leaflet-nav', name: 'leaflet-nav', moduleId: './leaflet-navigation', nav: true, title: 'Leaflet Navigation' },
      { route: 'dummy-move', name: 'dummy-move', moduleId: './dummy-move', nav: true, title: 'Dummy Move' }
    ]);

    this.router = router;
  }
}
