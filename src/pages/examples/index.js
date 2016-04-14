
export class Examples {
  configureRouter(config, router) {
    config.map([
      { route: '', redirect: 'rest' },
      { route: 'rest', name: 'rest', moduleId: './rest/index', nav: true, title: 'REST API' },
      { route: 'dummy-move', name: 'dummy-move', moduleId: './dummy-move', nav: true, title: 'Dummy Move', connected: true }
    ]);

    this.router = router;
  }
}
