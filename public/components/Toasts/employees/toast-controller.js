/**
 * Created by rafa on 11/03/2017.
 */
angular.module('checklist')
  .controller('ToastCtrl', function($scope, $mdToast, $mdDialog, message) {
    $scope.message = message;
    var isDlgOpen;
    $scope.closeToast = function() {
      if (isDlgOpen) return;

      $mdToast
        .hide()
        .then(function() {
          isDlgOpen = false;
        });
    };

    $scope.openMoreInfo = function(e) {
      if ( isDlgOpen ) return;
      isDlgOpen = true;

      $mdDialog
        .show($mdDialog
          .alert()
          .title('Больше информации тут')
          .textContent('ааа.')
          .ariaLabel('Больше инфорамции')
          .ok('Понятно')
          .targetEvent(e)
        )
        .then(function() {
          isDlgOpen = false;
        });
    };
  });