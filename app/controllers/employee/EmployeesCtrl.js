'use strict';

angular.module('Dataworks.controllers', ['ngRoute', 'ngMaterial'])
.controller('EmployeesCtrl', function($scope, $filter, APIservice, $mdDialog, $location) {

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
        APIservice.addEmployee($scope.newEmployee).success(function () {
            APIservice.getEmployees().success(function (response) {
                $scope.employees = response;
                if($location.$$path == '/teams') {
                    $location.path('/team');
                } else if($location.$$path == '/employees') {
                    $location.path('/employee');
                }

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

    $scope.showEmployeeInfo = function(info) {
        $mdDialog.show({
            clickOutsideToClose : true,
            controller: EmployeeDialogController,
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

    $scope.addTeam = function() {
        $mdDialog.show({
            clickOutsideToClose : true,
            controller: AddDialog,
            templateUrl: './views/addTeam.html'
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

function EmployeeDialogController($scope, $mdDialog, $location, employee, APIservice) {
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
            $location.path('/employee');
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