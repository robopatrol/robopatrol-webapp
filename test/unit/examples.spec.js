import {Examples} from '../../src/pages/examples/index';
import {DummyMove} from '../../src/pages/examples/dummy-move';
import {MapNavigation} from '../../src/pages/examples/map-navigation';


describe('the examples module', () => {
  var sut;

  beforeEach(() => {
    sut = new Examples();
  });

  it('defines a config map', () => {
    var config = jasmine.createSpyObj('config', ['map']);
    sut.configureRouter(config, {});
    expect(config.map).toHaveBeenCalled();
  });
});

describe('the dummy-move module', () => {
  var sut;

  beforeEach(() => {
    sut = new DummyMove();
  });

  it('moves with the defined speed', () => {
    spyOn(sut.cmdVel, 'publish');
    sut.move();
    expect(sut.twist.linear.x).toBe(0.5);
    expect(sut.twist.linear.y).toBe(0);
    expect(sut.twist.linear.z).toBe(0);
    expect(sut.cmdVel.publish).toHaveBeenCalled();
  });
});

describe('the map-navigation module', () => {
  var sut;

  beforeEach(() => {
    sut = new MapNavigation();
  });
});
