
export class Examples {
  configureRouter(config, router) {
    config.map([
      { route: '', redirect: 'rest' },
      { route: 'rest', name: 'rest', moduleId: './rest/index', nav: true, title: 'REST API' }
    ]);

    this.router = router;
  }
}
