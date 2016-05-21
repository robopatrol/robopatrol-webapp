import {Teleop} from '../../src/pages/teleop/index';

describe('the teleop module', () => {
  var sut;

  beforeEach(() => {
    sut = new Teleop();
  });

  it('should define an action for each button', ()=>{
    expect(sut.buttons).toBeDefined();
    sut.buttons.forEach((row)=> {
      row.forEach((btn) => {
        expect(btn.action).toBeDefined();
        expect(btn.icon).toBeDefined();
      });
    });
  });

  it('moves forward', () => {
    spyOn(sut.cmdVel, 'publish');
    sut.speed = 5;

    sut.executeAction('forwards');

    expect(sut.twist.linear.x).toBe(5);
    expect(sut.twist.angular.z).toBe(0);
    expect(sut.cmdVel.publish).toHaveBeenCalled();
  });

  it('moves forward-left', () => {
    spyOn(sut.cmdVel, 'publish');
    sut.speed = 5;
    sut.turn = 8;

    sut.executeAction('forwards-left');

    expect(sut.twist.linear.x).toBe(5);
    expect(sut.twist.angular.z).toBe(8);
    expect(sut.cmdVel.publish).toHaveBeenCalled();
  });

  it('moves forward right', () => {
    spyOn(sut.cmdVel, 'publish');
    sut.speed = 5;
    sut.turn = 8;

    sut.executeAction('forwards-right');

    expect(sut.twist.linear.x).toBe(5);
    expect(sut.twist.angular.z).toBe(-8);
    expect(sut.cmdVel.publish).toHaveBeenCalled();
  });

  it('moves left', () => {
    spyOn(sut.cmdVel, 'publish');
    sut.turn = 5;

    sut.executeAction('left');

    expect(sut.twist.linear.x).toBe(0);
    expect(sut.twist.angular.z).toBe(5);
    expect(sut.cmdVel.publish).toHaveBeenCalled();
  });

  it('moves right', () => {
    spyOn(sut.cmdVel, 'publish');
    sut.turn = 5;

    sut.executeAction('right');

    expect(sut.twist.linear.x).toBe(0);
    expect(sut.twist.angular.z).toBe(-5);
    expect(sut.cmdVel.publish).toHaveBeenCalled();
  });

  it('stops', () => {
    spyOn(sut.cmdVel, 'publish');
    sut.speed = 5;

    sut.executeAction('stop');

    expect(sut.twist.linear.x).toBe(0);
    expect(sut.twist.angular.z).toBe(0);
    expect(sut.cmdVel.publish).toHaveBeenCalled();
  });

  it('moves backward', () => {
    spyOn(sut.cmdVel, 'publish');
    sut.speed = 5;

    sut.executeAction('backwards');

    expect(sut.twist.linear.x).toBe(-5);
    expect(sut.twist.angular.z).toBe(0);
    expect(sut.cmdVel.publish).toHaveBeenCalled();
  });

  it('moves backwards-left', () => {
    spyOn(sut.cmdVel, 'publish');
    sut.speed = 5;
    sut.turn = 8;

    sut.executeAction('backwards-left');

    expect(sut.twist.linear.x).toBe(-5);
    expect(sut.twist.angular.z).toBe(-8);
    expect(sut.cmdVel.publish).toHaveBeenCalled();
  });

  it('moves backwards-right', () => {
    spyOn(sut.cmdVel, 'publish');
    sut.speed = 5;
    sut.turn = 8;

    sut.executeAction('backwards-right');

    expect(sut.twist.linear.x).toBe(-5);
    expect(sut.twist.angular.z).toBe(8);
    expect(sut.cmdVel.publish).toHaveBeenCalled();
  });

  it('doesnt move by default', () => {
    spyOn(sut.cmdVel, 'publish');
    sut.speed = 5;
    sut.turn = 8;

    sut.executeAction('foo');

    expect(sut.twist.linear.x).toBe(0);
    expect(sut.twist.angular.z).toBe(0);
    expect(sut.cmdVel.publish).toHaveBeenCalled();
  });
});
