'use strict';

angular.module('Dataworks.controllers')
    .controller('TeamsCtrl', function($scope, $filter, APIservice, $mdDialog) {

        $scope.nameFilter = null;
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

        /**
         * Dialog Functions
         * @param info
         */

        $scope.showTeamInfo = function(info) {
            $mdDialog.show({
                clickOutsideToClose : true,
                controller: TeamDialogController,
                locals:{
                    team: info
                },
                templateUrl: './views/teamInfo.html'
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

function TeamDialogController($scope, $mdDialog, $location, team, APIservice) {
    $scope.team = team;

    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.delete = function() {
        APIservice.deleteTeam($scope.team).success( function () {
            console.log("Team deleted.");
            $location.path('/team');
            $mdDialog.hide();
        });
    };

    $scope.edit = function() {
        $scope.team.description = "temporary";
        APIservice.editTeam($scope.team).success( function () {
            console.log("Team edited.");
            $mdDialog.hide();
        });
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

