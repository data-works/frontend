angular.module('Dataworks.services', []).
factory('APIservice', function($http) {

    var API = {};

    API.getEmployees = function() {
        return $http({
            method: 'GET',
            url: 'http://dataworks.elasticbeanstalk.com/employee'
        });
    };

    API.addEmployee = function(employee) {
        return $http({
            method : 'POST',
            url : 'http://dataworks.elasticbeanstalk.com/employee',
            data : employee
        });
    };

    API.deleteEmployee = function(employee) {
        return $http({
            method : 'DELETE',
            url : 'http://dataworks.elasticbeanstalk.com/employee/' + employee.id
        });
    };

    API.editEmployee = function(employee) {
        return $http({
            method : 'PUT',
            url : 'http://dataworks.elasticbeanstalk.com/employee',
            data : employee
        });
    };

    API.getTeams = function() {
        return $http({
            method: 'GET',
            url: 'http://dataworks.elasticbeanstalk.com/team'
        });
    };

    API.addTeam = function(team) {
        return $http({
            method : 'POST',
            url : 'http://dataworks.elasticbeanstalk.com/team',
            data : team
        });
    };

    API.deleteTeam = function(team) {
        return $http({
            method : 'DELETE',
            url : 'http://dataworks.elasticbeanstalk.com/team/' + team.id
        });
    };

    API.editTeam = function(team) {
        return $http({
            method : 'PUT',
            url : 'http://dataworks.elasticbeanstalk.com/team',
            data : team
        });
    };

    return API;
});