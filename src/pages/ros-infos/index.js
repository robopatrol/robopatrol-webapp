
export class RosInfos {

  configureRouter(config, router) {
    config.map([
      { route: '', redirect: 'nodes' },
      { route: 'nodes', name: 'nodes', moduleId: 'pages/ros-infos/nodes', nav: true, title: 'Nodes' },
      { route: 'params', name: 'params', moduleId: 'pages/ros-infos/params', nav: true, title: 'Params' },
      { route: 'services', name: 'services', moduleId: 'pages/ros-infos/services', nav: true, title: 'Services' },
      { route: 'topics', name: 'topics', moduleId: 'pages/ros-infos/topics', nav: true, title: 'Topics' },
    ]);

    this.router = router;
  }
}
