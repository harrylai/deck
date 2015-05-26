'use strict';

describe('Controller: tasks', function () {
  var controller;
  var controllerInjector;
  var scope;

  controllerInjector = function (appData) {
    appData.registerAutoRefreshHandler = angular.noop;
    return function ($controller, $rootScope) {
      var viewStateCache = { createCache: function() { return { get: angular.noop, put: angular.noop }; }};
      scope = $rootScope.$new();
      controller = $controller('TasksCtrl', { application: appData, $scope: scope, viewStateCache: viewStateCache });
    };
  };

  beforeEach(module('spinnaker.tasks.main'));

  beforeEach(
    inject(
      controllerInjector({})
    )
  );

  describe('initialization', function() {
    it('tasksLoaded flag should be false', function() {
      scope.$digest();
      expect(controller.tasksLoaded).toBe(false);
    });

    it('tasksLoaded flag should be true if tasks object is present on application', function() {
      inject(controllerInjector({tasks: [] }));
      scope.$digest();
      expect(controller.tasksLoaded).toBe(true);
    });
  });

  describe('Filtering Task list with one running task', function () {
    var application = {
      tasks: [
        {status: 'COMPLETED', name: 'a'},
        {status: 'RUNNING', name: 'a'},
      ]
    };

    beforeEach(
      inject(
        controllerInjector(application)
      )
    );

    it('should sort the tasks with the RUNNING status at the top', function () {
      controller.sortTasks();
      expect(controller.sortedTasks.length).toBe(2);
      expect(controller.sortedTasks[0].status).toEqual('RUNNING');
    });
  });

  describe('Filtering Task list by startTime in descending order with only running task', function () {
    var application = {
      tasks: [
        {status: 'RUNNING', startTime:20, name: 'a'},
        {status: 'RUNNING', startTime:99, name: 'a'},
      ]
    };

    beforeEach(
      inject(
        controllerInjector(application)
      )
    );

    it('should sort the tasks with the RUNNING status at the top', function () {
      controller.sortTasks();
      var sortedList = controller.sortedTasks;
      expect(sortedList.length).toBe(2);
      expect(sortedList[0].startTime).toBe(99);
      sortedList.forEach(function(task) {
        expect(task.status).toEqual('RUNNING');
      });
    });
  });

  describe('Filtering Task list with zero running task', function () {
    var application = {
      tasks: [
        {status: 'COMPLETED', startTime: 22, name: 'a'},
        {status: 'COMPLETED', startTime: 100, name: 'a'},
      ]
    };

    beforeEach(
      inject(
        controllerInjector(application)
      )
    );

    it('should sort the tasks in descending order by startTime', function () {
      controller.sortTasks();
      var sortedList = controller.sortedTasks;
      expect(sortedList.length).toBe(2);
      expect(sortedList[0].startTime).toBe(100);
      sortedList.forEach(function(task) {
        expect(task.status).toEqual('COMPLETED');
      });
    });
  });


});
