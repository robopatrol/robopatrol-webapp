import {Notifications} from '../../src/components/notifications';

describe('the notification module', () => {
  var sut;

  beforeEach(() => {
    var ea = {subscribe: ()=>{}};
    sut = new Notifications(ea);
  });

  it('can be closed', ()=>{
    sut.notification = 'test';
    sut.close();
    expect(sut.notification).toBe(null);
  });
});
