import {
  Schedule
} from '../../src/pages/schedule/index';

import {
  HttpStub
} from './stubs/http-stub';
import {
  DialogStub
} from './stubs/dialog-stub';
import {
  EventAggregator
} from './stubs/event-aggregator-stub';


describe('the schedule module', () => {
  var sut;
  var mockedHttp;
  var mockedDialog;

  beforeEach(() => {
    mockedHttp = new HttpStub();
    mockedDialog = new DialogStub();
    sut = new Schedule(mockedDialog, mockedHttp);
  });

  it('saves a new schedule', (done) => {
    spyOn(sut, 'post').and.callThrough();
    mockedDialog.response = {
      wasCancelled: false,
      output: {id: 1}
    };

    sut.addSchedule();

    Promise.resolve('done').then(function() {
      expect(sut.post).toHaveBeenCalled();
      done();
    });
  });

  it('saves an edited schedule', (done) => {
    mockedDialog.response = {
      wasCancelled: false,
      output: {id: 2}
    };
    spyOn(sut, 'put').and.callThrough();

    sut.editSchedule({id: 2});

    Promise.resolve('done').then(function() {
      expect(sut.put).toHaveBeenCalled();
      expect(sut.put).toHaveBeenCalledWith({id:2});
      done();
    });
  });

  it('it doesnt save an edited schedule after cancelling', (done) => {
    mockedDialog.response = {
      wasCancelled: true,
      output: {id: 2}
    };
    spyOn(sut, 'put');
    spyOn(sut, 'loadSchedules');

    sut.editSchedule({id: 2});

    Promise.resolve('done').then(function() {
      expect(sut.put).not.toHaveBeenCalled();
      expect(sut.loadSchedules).toHaveBeenCalled();
      done();
    });
  });

  it('deletes a deleted schedule', (done) => {
    mockedDialog.response = {
      wasCancelled: false,
      output: {id: 2}
    };
    spyOn(sut, 'delete').and.callThrough();

    sut.deleteSchedule({id: 2});

    Promise.resolve('done').then(function() {
      expect(sut.delete).toHaveBeenCalled();
      expect(sut.delete).toHaveBeenCalledWith({id:2});
      done();
    });
  });

  it('doesnt deletes a schedule after cancelling', (done) => {
    mockedDialog.response = {
      wasCancelled: true,
      output: {id: 2}
    };
    spyOn(sut, 'delete');

    sut.deleteSchedule({id: 2});

    Promise.resolve('done').then(function() {
      expect(sut.delete).not.toHaveBeenCalled();
      done();
    });
  });
});
