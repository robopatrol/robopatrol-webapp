import {RosInfos} from '../../src/pages/ros-infos/index';
import {RosNodes} from '../../src/pages/ros-infos/nodes';
import {RosServices} from '../../src/pages/ros-infos/services';
import {RosParams} from '../../src/pages/ros-infos/params';
import {RosTopcis} from '../../src/pages/ros-infos/topics';

describe('the ros-infos module', () => {
  var sut;

  beforeEach(() => {
    sut = new RosInfos();
  });
});

describe('the ros-infos nodes module', () => {
  var sut;

  beforeEach(() => {
    sut = new RosNodes();
  });
});

describe('the ros-infos services module', () => {
  var sut;

  beforeEach(() => {
    sut = new RosServices();
  });
});

describe('the ros-infos params module', () => {
  var sut;

  beforeEach(() => {
    sut = new RosParams();
  });
});

describe('the ros-infos topics module', () => {
  var sut;

  beforeEach(() => {
    sut = new RosTopcis();
  });
});
