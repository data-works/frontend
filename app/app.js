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
  when('/team', {
    redirectTo: '/teams'
  }).
  when('/employee', {
    redirectTo: '/employees'
  }).
  otherwise({redirectTo: '/employees'});
}])
    .config(function($mdThemingProvider) {
      $mdThemingProvider.definePalette('customWhite', {
        '50': 'ffffff',
        '100': 'ffffff',
        '200': 'ffffff',
        '300': 'ffffff',
        '400': 'ffffff',
        '500': 'ffffff',
        '600': 'ffffff',
        '700': 'ffffff',
        '800': 'ffffff',
        '900': 'ffffff',
        'A100': 'ffffff',
        'A200': 'ffffff',
        'A400': 'ffffff',
        'A700': 'ffffff',
        'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                            // on this palette should be dark or light
        'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
          '200', '300', '400', 'A100'],
        'contrastLightColors': undefined    // could also specify this if default was 'dark'
      });
      $mdThemingProvider
          .theme('default')
          .primaryPalette('blue')
          .accentPalette('customWhite');
    });
