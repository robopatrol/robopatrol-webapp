export class RouterStub {
  pipelineSteps = [];

  configure(handler) {
    handler(this);
  }

  map(routes) {
    this.routes = routes;
  }

  addPipelineStep(name, step) {
    this.pipelineSteps.push(step);
  }

  navigate(route) {}
}
