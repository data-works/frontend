'use strict';

// Declare app level module which depends on partials, and components
angular.module('Dataworks', [
  'ngRoute',
  'ngMdIcons',
  'Dataworks.controllers',
  'Dataworks.services'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/employees', {
    templateUrl: 'views/employees.html',
    controller: 'EmployeesCtrl'
  }).
  when('/teams', {
    templateUrl: 'views/teams.html',
    controller: 'TeamsCtrl'
  }).
  otherwise({redirectTo: '/employees'});
}])
    .config(function($mdThemingProvider) {
      $mdThemingProvider
          .theme('default')
          .primaryPalette('blue')
          .accentPalette('red');
    });
