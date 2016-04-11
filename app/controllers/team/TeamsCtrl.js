'use strict';

angular.module('Dataworks.controllers')
    .controller('TeamsCtrl', function($scope, $filter, APIservice, $mdDialog) {

        $scope.teams = [];
        $scope.newTeam = {};

        /**
         * Sorting
         * @type {string}
         */
        $scope.sortName = 'name';
        $scope.reverse = false;
        $scope.order = function(sortName) {
            $scope.reverse = ($scope.sortName === sortName) ?
                !$scope.reverse : false;
            $scope.sortName = sortName;
        };

        /**
         * APIService functions
         */
        APIservice.getTeams().success(function (response) {
            $scope.teams = response;
        });


    });