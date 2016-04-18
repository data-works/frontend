'use strict';

angular.module('Dataworks.controllers', ['ngRoute', 'ngMaterial'])

.config(function($mdThemingProvider) {
    $mdThemingProvider
        .theme('default')
        .primaryPalette('blue')
        .accentPalette('red');
})

.controller('EmployeesCtrl', function($scope, $filter, APIservice, $mdDialog, $location, $mdToast) {

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

    $scope.customSort = function(value) {
        if($scope.sortName === 'lastName') {
            return value.lastName;
        }
        if($scope.sortName === 'emails') {
            if(value.emails) {
                return $scope.getPrimaryItem(value.emails).email;
            }
        }
        if($scope.sortName === 'addresses') {
            if(value.addresses) {
                return $scope.getPrimaryItem(value.addresses).country;
            }
        }
        return;
    };

    /**
     * Variables, Arrays, Objects
     * @type {null}
     */
    $scope.nameFilter = null;
    $scope.employees = [];

    $scope.isEditing = false;

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
    $scope.newAddress = {};
    $scope.newAddresses = [];
    $scope.newEmail = {};
    $scope.newEmails = [];

    $scope.addEmployee = function() {

        $scope.newEmail.primary = true;
        $scope.newAddress.primary = true;
        $scope.newAddress.country = "USA";

        if($scope.newEmail.email !== undefined) {
            $scope.newEmails.push($scope.newEmail);
            $scope.newEmployee.emails = $scope.newEmails;
        }

        if($scope.newAddress.line1 !== undefined) {
            if($scope.newAddress.line2 === undefined) {
                $scope.newAddress.line2 = "";
            }
            if($scope.newAddress.city === undefined) {
                $scope.newAddress.city = "";
            }
            if($scope.newAddress.postalCode === undefined) {
                $scope.newAddress.postalCode = "";
            }
            if($scope.newAddress.state === undefined) {
                $scope.newAddress.state = "";
            }
            $scope.newAddresses.push($scope.newAddress);
            $scope.newEmployee.addresses = $scope.newAddresses;
        }

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
                employee: info,
                isEditing: $scope.isEditing,
                newEmployee: $scope.newEmployee
            },
            templateUrl: './views/employeeInfo.html'
        });
    };

    $scope.addEmp = function() {
        $mdDialog.show({
            clickOutsideToClose : false,
            controller: AddDialog,
            templateUrl: './views/addEmployee.html'
        });
    };

    $scope.addTeam = function() {
        $mdDialog.show({
            clickOutsideToClose : false,
            controller: AddDialog,
            templateUrl: './views/addTeam.html'
        });
    };

    /**
     * Toast Function
     */

    $scope.toastMessage = function(message) {
        $mdToast.show(
            $mdToast.simple()
                .textContent(message)
                .position('bottom right')
                .hideDelay(2000)
        );
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

function EmployeeDialogController($scope, $mdDialog, $location, employee, APIservice, $mdToast, isEditing, newEmployee) {
    $scope.employee = employee;

    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $location.path('/employee');
        $mdDialog.cancel();
    };

    $scope.softCancel = function() {
        $mdDialog.cancel();
    };

    $scope.toastMessage = function(message) {
        $mdToast.show(
            $mdToast.simple()
                .textContent(message)
                .position('bottom right')
                .hideDelay(2000)
        );
    };

    $scope.delete = function() {
        APIservice.deleteEmployee($scope.employee).success( function () {
            console.log("Employee deleted.");
            $location.path('/employee');
            $mdDialog.hide();
        });
    };

    $scope.toggleEdit = function () {
        $scope.isEditing = !isEditing;
    };

    $scope.edit = function() {
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