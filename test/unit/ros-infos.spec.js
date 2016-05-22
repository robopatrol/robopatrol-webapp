import {RosInfos} from '../../src/pages/ros-infos/index';
import {RosNodes} from '../../src/pages/ros-infos/nodes';
import {RosServices} from '../../src/pages/ros-infos/services';
import {RosParams} from '../../src/pages/ros-infos/params';
import {RosTopics} from '../../src/pages/ros-infos/topics';

describe('the ros-infos module', () => {
  var sut;

  beforeEach(() => {
    sut = new RosInfos();
  });

  it('defines a config map', () => {
    var config = jasmine.createSpyObj('config', ['map']);
    sut.configureRouter(config, {});
    expect(config.map).toHaveBeenCalled();
  });
});

describe('the ros-infos nodes module', () => {
  var sut;

  beforeEach(() => {
    var ros = {
      getNodes: () => {
        return new Promise(function(resolve, reject) {
          resolve(['item1', 'item2']);
        });
      }
    };
    sut = new RosNodes(ros);
  });

  it('defines some node items', () => {
    expect(sut.items).toBeDefined();
  });

  it('does something', () => {
    spyOn(sut.ros, 'getNodes').and.callThrough();
    sut.activate();
    expect(sut.ros.getNodes).toHaveBeenCalled();
  });

});

describe('the ros-infos services module', () => {
  var sut;

  beforeEach(() => {
    var ros = {
      getServices: () => {
        return new Promise(function(resolve, reject) {
          resolve(['item1', 'item2']);
        });
      }
    };
    sut = new RosServices(ros);
  });

  it('defines some node items', () => {
    expect(sut.items).toBeDefined();
  });

  it('fetches some services', () => {
    spyOn(sut.ros, 'getServices').and.callThrough();
    sut.activate();

    expect(sut.ros.getServices).toHaveBeenCalled();
  });

});

describe('the ros-infos params module', () => {
  var sut;

  beforeEach(() => {
    var ros = {
      getParams: () => {
        return new Promise(function(resolve, reject) {
          resolve(['item1', 'item2']);
        });
      }
    };
    sut = new RosParams(ros);
  });

  it('defines some node items', () => {
    expect(sut.items).toBeDefined();
  });

  it('fetches some params', () => {
    spyOn(sut.ros, 'getParams').and.callThrough();
    sut.activate();

    expect(sut.ros.getParams).toHaveBeenCalled();
  });
});

describe('the ros-infos topics module', () => {
  var sut;

  beforeEach(() => {
    var ros = {
      getTopics: () => {
        return new Promise(function(resolve, reject) {
          resolve(['item1', 'item2']);
        });
      }
    };
    sut = new RosTopics(ros);
  });

  it('defines some topic items', () => {
    expect(sut.items).toBeDefined();
  });

  it('fetches some topics', ()=>{
    spyOn(sut.ros, 'getTopics').and.callThrough();
    sut.activate();

    expect(sut.ros.getTopics).toHaveBeenCalled();

  });
});
