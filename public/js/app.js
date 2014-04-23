'use strict';

angular.module('myApp',['myApp.factory']).
	config(['$routeProvider','$locationProvider', function ($routeProvider,$locationProvider) {
    $routeProvider.
      when('/',{
        templateUrl: 'partials/index',
        controller: IndexCtrl
      }).
      when('/process/',{
        templateUrl: 'partials/process',
        controller: ProcessCtrl
      }).
      otherwise({
        redirectTo: '/'
      });
      $locationProvider.html5Mode(true);
  }]);