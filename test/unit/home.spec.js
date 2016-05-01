import {Home} from '../../src/pages/home';

describe('the home module', () => {
  var sut;

  beforeEach(() => {
    sut = new Home();
  });

  it('contains a heading', () => {
    expect(sut.heading).toBeDefined();
  });

  it('configures the heading', () => {
    expect(sut.heading).toEqual('Welcome to Robopatrol');
  });
});
