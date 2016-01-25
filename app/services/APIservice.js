angular.module('Dataworks.services', []).
factory('APIservice', function($http) {

    var API = {};

    API.getEmployees = function() {
        return $http({
            method: 'GET',
            url: 'http://dataworks.elasticbeanstalk.com/employee'
        });
    };

    return API;
});