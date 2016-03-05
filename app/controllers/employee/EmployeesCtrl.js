'use strict';

angular.module('Dataworks.controllers', ['ngRoute', 'ngMaterial'])

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
        .accentPalette('red');
})

.controller('EmployeesCtrl', function($scope, $filter, APIservice, $mdDialog) {
    $scope.w = window.innerWidth;
    $scope.h = window.innerHeight;

    $scope.nameFilter = null;
    $scope.employees = [];

    $scope.headers = [
        {
            title: "Name"
        },
        {
            title: "Email Address"
        },
        {
            title: "Country"
        }
    ]

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
}