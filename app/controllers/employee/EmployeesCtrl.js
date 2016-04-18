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
        $scope.newPhone = {};
        $scope.newPhones = [];

        $scope.addEmployee = function() {

            $scope.newEmail.primary = true;
            $scope.newAddress.primary = true;
            $scope.newAddress.country = "USA";
            $scope.newPhone.primary = true;

            if($scope.newEmail.email !== undefined) {
                $scope.newEmails.push($scope.newEmail);
                $scope.newEmployee.emails = $scope.newEmails;
            }

            if($scope.newPhone.number !== undefined) {
                $scope.newPhones.push($scope.newPhone);
                $scope.newEmployee.telephones = $scope.newPhones;
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
    })

    /**
     * Phone Number directive
     */

    .directive('phoneInput', function($filter, $browser) {
        return {
            require: 'ngModel',
            link: function($scope, $element, $attrs, ngModelCtrl) {
                var listener = function() {
                    var value = $element.val().replace(/[^0-9]/g, '');
                    $element.val($filter('tel')(value, false));
                };

                // This runs when we update the text field
                ngModelCtrl.$parsers.push(function(viewValue) {
                    return viewValue.replace(/[^0-9]/g, '').slice(0,10);
                });

                // This runs when the model gets updated on the scope directly and keeps our view in sync
                ngModelCtrl.$render = function() {
                    $element.val($filter('tel')(ngModelCtrl.$viewValue, false));
                };

                $element.bind('change', listener);
                $element.bind('keydown', function(event) {
                    var key = event.keyCode;
                    // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                    // This lets us support copy and paste too
                    if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40)){
                        return;
                    }
                    $browser.defer(listener); // Have to do this or changes don't get picked up properly
                });

                $element.bind('paste cut', function() {
                    $browser.defer(listener);
                });
            }

        };
    })

    /**
     * Phone Number Filter
     */

    .filter('tel', function () {
        return function (tel) {
            console.log(tel);
            if (!tel) { return ''; }

            var value = tel.toString().trim().replace(/^\+/, '');

            if (value.match(/[^0-9]/)) {
                return tel;
            }

            var country, city, number;

            switch (value.length) {
                case 1:
                case 2:
                case 3:
                    city = value;
                    break;

                default:
                    city = value.slice(0, 3);
                    number = value.slice(3);
            }

            if(number){
                if(number.length>3){
                    number = number.slice(0, 3) + '-' + number.slice(3,7);
                }
                else{
                    number = number;
                }

                return ("(" + city + ") " + number).trim();
            }
            else{
                return "(" + city;
            }

        };
    });

/**
 Dialog Function(s)
 */

function EmployeeDialogController($scope, $mdDialog, $location, $filter, employee, APIservice, $mdToast, isEditing, newEmployee) {
    $scope.employee = employee;

    $scope.getPrimaryItem = function (items) {
        return $filter('filter')(items, {primary:true})[0];
    };

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