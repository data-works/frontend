'use strict';
// 'ng-mfb'
angular.module('Dataworks.controllers', ['ngRoute', 'ngMaterial', 'ng-mfb'])

.config(['$routeProvider', function($routeProvider, $mdThemingProvider) {
    $routeProvider.when('/employees', {
        templateUrl: 'views/employees.html',
        controller: 'EmployeesCtrl'
    })

}])

/**
 * Configuration for dwApp
 */
.config(function($mdThemingProvider) {
    $mdThemingProvider
        .theme('default')
        .primaryPalette('blue')
        .accentPalette('blue');
})

.controller('EmployeesCtrl', function($scope, $filter, APIservice, $mdDialog) {

    $scope.sortName = 'lastName';
    $scope.reverse = false;
    $scope.order = function(sortName) {
        $scope.reverse = ($scope.sortName === sortName) ?
            !$scope.reverse : false;
        $scope.sortName = sortName;
    };

    $scope.nameFilter = null;
    $scope.employees = [];

    $scope.headers = [
        {
            title: "Name",
            sortName: "lastName"
        },
        {
            title: "Email Address",
            sortName: "email"
        },
        {
            title: "Country",
            sortName: "country"
        }
    ]

    /**
     * FAB variable(s)
     */
    $scope.isOpen = 'closed';

    APIservice.getEmployees().success(function (response) {
        $scope.employees = response;
    });

    $scope.getPrimaryItem = function (items) {
        return $filter('filter')(items, {primary:true})[0];
    };

    $scope.getPhone = function (item) {
        var phone = this.getPrimaryItem(item);
        var phoneNumber = "";
        if(phone.countryCode)
            phoneNumber += phone.countryCode + " ";
        if(phone.areaCode)
            phoneNumber += phone.areaCode + " ";
        if(phone.number)
            phoneNumber += phone.number + " ";
        if(phone.extension)
            phoneNumber += phone.extension + " ";

        return phoneNumber;
    };

    $scope.showInfo = function(info) {
        $mdDialog.show({
            clickOutsideToClose : true,
            controller: DialogController,
            locals:{
                employee: info
            },
            templateUrl: './views/employeeInfo.html'
        });
    };

    $scope.addEmp = function() {
        $mdDialog.show({
            clickOutsideToClose : true,
            controller: AddDialog,
            templateUrl: './views/addEmployee.html'
        });
    };
})

/**
 * Search multiple fields separated by a space
 */
    .filter('filterBy', function() {
    return function(array, query) {

        var parts = query && query.trim().split(/\s+/),
            keys = Object.keys(array[0]);

        if (!parts || !parts.length) {
            return array;
        }

        return array.filter(function(obj) {
            return parts.every(function(part) {
                return keys.some(function(key) {
                    return String(obj[key]).toLowerCase().indexOf(part.toLowerCase()) > -1;
                });
            });
        });
    };
});

/**
 Dialog Function
 */

function DialogController($scope, $mdDialog, employee) {
    $scope.employee = employee;

    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.getPhone = function (phone) {
        var phoneNumber = "";
        if(phone.countryCode)
            phoneNumber += phone.countryCode + " ";
        if(phone.areaCode)
            phoneNumber += phone.areaCode + " ";
        if(phone.number)
            phoneNumber += phone.number + " ";
        if(phone.extension)
            phoneNumber += phone.extension + " ";

        return phoneNumber;
    };
};

function AddDialog($scope, $mdDialog) {

    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };

};