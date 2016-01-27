'use strict';

angular.module('Dataworks.controllers', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/employees', {
        templateUrl: 'views/employees.html',
        controller: 'EmployeesCtrl'
    });
}])

.controller('EmployeesCtrl', function($scope, $filter, APIservice) {
    $scope.nameFilter = null;
    $scope.employees = [];


    APIservice.getEmployees().success(function (response) {
        $scope.employees = response;
    });

    $scope.getPrimaryItem = function (items) {
        return $filter('filter')(items, {primary:true})[0];
    };
});