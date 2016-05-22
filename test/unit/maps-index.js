import {Index} from '../../src/pages/maps/index';

import {RosStub} from './stubs/ros-stub';
import {MapServiceStub} from './stubs/map-service-stub';
import {HttpStub} from './stubs/http-stub';
import {DialogStub} from './stubs/dialog-stub';

describe('the map index module', () => {
  var sut;
  var mockedMapService;
  var mockedHttp;
  var mockedDialog;

  beforeEach(() => {
    mockedMapService = new MapServiceStub();
    mockedHttp = new HttpStub();
    mockedDialog = new DialogStub();
    sut = new Index(mockedMapService, mockedDialog, mockedHttp);
  });

  it('contains a dialogService property', () => {
    expect(sut.dialogService).toBeDefined();
  });

  it('configures the dialogService property', () => {
    expect(sut.dialogService).toEqual(mockedDialog);
  });

  it('contains a http property', () => {
    expect(sut.http).toBeDefined();
  });

  it('configures the http property', () => {
    expect(sut.http).toEqual(mockedHttp);
  });

  it('contains a mapService property', () => {
    expect(sut.mapService).toBeDefined();
  });

  it('configures the mapService property', () => {
    expect(sut.mapService).toEqual(mockedMapService);
  });

  it('contains a items property', () => {
    expect(sut.items).toBeDefined();
  });

  it('configures the items property', () => {
    expect(sut.items).toEqual([]);
  });

  it('loads the maps on activate', () => {
    spyOn(sut, 'loadMaps');
    sut.activate();
    expect(sut.loadMaps).toHaveBeenCalled();
  });

  it('loads the maps from remote source', (done) => {
    spyOn(mockedHttp, 'fetch').and.callThrough();
    sut.loadMaps().then(() => {
      expect(mockedHttp.fetch).toHaveBeenCalled();
      done();
    }).catch(() => {
      done();
    });
  });

  it('loads the maps from remote source and update items', (done) => {
    var items = [{id: 123, name: 'test', filename: 'test.yaml'}];
    mockedHttp.itemStub = items;
    spyOn(mockedHttp, 'fetch').and.callThrough();
    sut.loadMaps().then(() => {
      expect(sut.items).toEqual(items);
      done();
    }).catch(() => {
      done();
    });
  });

  it('create function starts the map recording service', (done) => {
    spyOn(mockedMapService, 'startMapRecording').and.callThrough();
    sut.create();

    Promise.resolve('done').then(() => {
      expect(mockedMapService.startMapRecording).toHaveBeenCalled();
      done();
    }).catch(() => { done(); });
  });

  it('loads maps after map creation', (done) => {
    mockedDialog.response = {
      wasCancelled: false,
      output: {}
    };

    spyOn(sut, 'loadMaps').and.callThrough();
    sut.create();

    Promise.resolve('done').then(() => { // map-service promise
      Promise.resolve('done').then(() => { // dialog promise
        expect(sut.loadMaps).toHaveBeenCalled();
      }).catch(() => { done(); });
      done();
    }).catch(() => { done(); });
  });

  it('delete function calls map service delete', (done) => {
    var item = {id: 123, name: 'test', filename: 'test.yaml'};
    spyOn(mockedMapService, 'deleteMap').and.callThrough();

    sut.delete(item);

    Promise.resolve('done').then(() => {
      expect(mockedMapService.deleteMap).toHaveBeenCalledWidth(item.id);
      done();
    }).catch(() => { done(); });
  });

  it('loads maps after delete', (done) => {
    var item = {id: 123, name: 'test', filename: 'test.yaml'};

    spyOn(sut, 'loadMaps').and.callThrough();

    sut.delete(item);

    Promise.resolve('done').then(() => { // map-service promise
      expect(sut.loadMaps).toHaveBeenCalled();
      done();
    }).catch(() => { done(); });
  });

  it('use function starts map server', (done) => {
    var item = {id: 123, name: 'test', filename: 'test.yaml'};
    spyOn(mockedMapService, 'startMapServer').and.callThrough();
    sut.use(item);

    Promise.resolve('done').then(() => {
      expect(mockedMapService.startMapServer).toHaveBeenCalledWith(item.filename);
      done();
    }).catch(() => { done(); });
  });
});
