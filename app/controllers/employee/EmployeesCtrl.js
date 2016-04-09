'use strict';

angular.module('Dataworks.controllers', ['ngRoute', 'ngMaterial'])

.config(['$routeProvider', function($routeProvider) {
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
        .accentPalette('red');
})

.controller('EmployeesCtrl', function($scope, $filter, APIservice, $mdDialog) {

    /**
     * Sorting
     * @type {string}
     */
    $scope.sortName = 'lastName';
    $scope.reverse = false;
    $scope.order = function(sortName) {
        $scope.reverse = ($scope.sortName === sortName) ?
            !$scope.reverse : false;
        $scope.sortName = sortName;
    };

    /**
     * Variables, Arrays, Objects
     * @type {null}
     */
    $scope.nameFilter = null;
    $scope.employees = [];

    // Genders
    $scope.genders = [
        {type: "Male", value: "male"},
        {type: "Female", value: "female"},
        {type: "Prefer Not To Specify", value: null}
    ];

    // States
    $scope.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
    'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
    'WY').split(' ').map(function(state) {
        return {abbrev: state};
    });


    /**
     * APIService functions
     */

    APIservice.getEmployees().success(function (response) {
        $scope.employees = response;
    });

    $scope.newEmployee = {};

    $scope.addEmployee = function() {
        APIservice.addEmployee($scope.newEmployee).success( function () {
            APIservice.getEmployees().success(function (response) {
                $scope.employees = response;
            });
        });
    };

    /**
     * Methods for handling data
     * @param items
     * @returns {*}
     */

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

    /**
     * Dialog Functions
     * @param info
     */

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
 * Search multiple fields separated by a space. Custom filter.
 */
    .filter('filterBy', function() {
    return function(array, query) {

        if (array[0] != null) {
            var parts = query && query.trim().split(/\s+/),
                keys = Object.keys(array[0]);
        }

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
 Dialog Function(s)
 */

function DialogController($scope, $mdDialog, employee, APIservice) {
    $scope.employee = employee;

    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.delete = function() {
        APIservice.deleteEmployee($scope.employee).success( function () {
            console.log("Employee deleted.");
            $mdDialog.hide();
        });
    };

    $scope.edit = function() {
        $scope.employee.firstName = "temporary";
        APIservice.editEmployee($scope.employee).success( function () {
            console.log("Employee edited.");
            $mdDialog.hide();
        });
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