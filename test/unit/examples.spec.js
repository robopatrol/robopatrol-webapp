import {Examples} from '../../src/pages/examples/index';
import {DummyMove} from '../../src/pages/examples/dummy-move';
import {MapNavigation} from '../../src/pages/examples/map-navigation';


describe('the examples module', () => {
  var sut;

  beforeEach(() => {
    sut = new Examples();
  });
});

describe('the dummy-move module', () => {
  var sut;

  beforeEach(() => {
    sut = new DummyMove();
  });
});

describe('the map-navigation module', () => {
  var sut;

  beforeEach(() => {
    sut = new MapNavigation();
  });
});
