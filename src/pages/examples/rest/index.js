
export class Index {
  configureRouter(config, router) {
    config.map([
      { route: ['', '/'], name: 'list', moduleId: './list', nav: false, title: 'List' },
      { route: '/create', name: 'create', moduleId: './create', nav: false, title: 'Create' },
      { route: '/:id', name: 'detail', moduleId: './detail', nav: false, title: 'Detail' },
      { route: '/:id/edit', name: 'edit', moduleId: './edit', nav: false, title: 'Edit' },
      { route: '/:id/delete', name: 'delete', moduleId: './delete', nav: false, title: 'Delete' }
    ]);

    this.router = router;
  }
}
