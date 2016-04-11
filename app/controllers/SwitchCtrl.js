angular.module('Dataworks.controllers')
    .controller('SwitchCtrl', function($scope, $location) {
        $scope.onChange = function(state) {

            if(state == false) {
                view = '/employees';
            } else {
                view = '/teams';
            }
            $location.path(view);
        };
    });

