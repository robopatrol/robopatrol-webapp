import {Ros, Topic, Message, Service, ServiceRequest} from '../../src/lib/ros';


describe('the lib ros module', () => {
  var sut;

  beforeEach(() => {
    sut = new Ros();
  });
});

describe('the lib ros topic module', () => {
  var sut;

  beforeEach(() => {
    sut = new Topic();
  });
});

describe('the lib ros module', () => {
  var sut;

  beforeEach(() => {
    sut = new Message();
  });
});

describe('the lib ros service module', () => {
  var sut;

  beforeEach(() => {
    sut = new Service();
  });
});

describe('the lib ros service request module', () => {
  var sut;

  beforeEach(() => {
    sut = new ServiceRequest();
  });
});
