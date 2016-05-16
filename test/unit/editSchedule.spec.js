import {
  EditSchedule
} from '../../src/pages/schedule/editSchedule';

export class ControllerStub {
  ok(result) {
    this.result = result;
  }
}

describe('the edit schedule dialog', () => {
  var sut;
  var controller;

  beforeEach(() => {
    controller = new ControllerStub();
    sut = new EditSchedule(controller);
  });

  it('sets the title', () => {
    sut.activate();
    expect(sut.title).toBe("Add schedule");
  });

  it('sets the title', () => {
    sut.activate({
      id: 1
    });
    expect(sut.title).toBe("Edit schedule");
  });

  it('converts the input to a cron string', () => {
    var schedule = {
      second: 1,
      minute: 2,
      hour: 3,
      day: 'Friday',
      month: 5
    };
    sut.convert(schedule);
    expect(controller.result.cron).toBe('1 2 3 * 5 4');
    expect(controller.result.second).not.toBeDefined();
    expect(controller.result.minute).not.toBeDefined();
    expect(controller.result.hour).not.toBeDefined();
    expect(controller.result.day).not.toBeDefined();
    expect(controller.result.month).not.toBeDefined();
  });

  it('converts the input to a cron string with day not set', () => {
    var schedule = {
      second: 1,
      minute: 2,
      hour: 3,
      day: '*',
      month: 5
    };
    sut.convert(schedule);
    expect(controller.result.cron).toBe('1 2 3 * 5 *');
    expect(controller.result.second).not.toBeDefined();
    expect(controller.result.minute).not.toBeDefined();
    expect(controller.result.hour).not.toBeDefined();
    expect(controller.result.day).not.toBeDefined();
    expect(controller.result.month).not.toBeDefined();
  });
});
