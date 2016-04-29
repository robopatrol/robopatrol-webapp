import {Index} from '../../src/pages/examples/rest/index';
import {Create} from '../../src/pages/examples/rest/create';
import {Delete} from '../../src/pages/examples/rest/delete';
import {Detail} from '../../src/pages/examples/rest/detail';
import {Edit} from '../../src/pages/examples/rest/edit';
import {List} from '../../src/pages/examples/rest/list';


describe('the examples rest index module', () => {
  var sut;

  beforeEach(() => {
    sut = new Index();
  });
});

describe('the examples rest create module', () => {
  var sut;

  beforeEach(() => {
    sut = new Create();
  });
});

describe('the examples rest delete module', () => {
  var sut;

  beforeEach(() => {
    sut = new Delete();
  });
});

describe('the examples rest detail module', () => {
  var sut;

  beforeEach(() => {
    sut = new Detail();
  });
});

describe('the examples rest edit module', () => {
  var sut;

  beforeEach(() => {
    sut = new Edit();
  });
});

describe('the examples rest list module', () => {
  var sut;

  beforeEach(() => {
    sut = new List();
  });
});
