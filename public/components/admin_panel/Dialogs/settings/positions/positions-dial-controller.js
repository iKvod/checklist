/**
 * Created by rafa on 14/03/2017.
 */
/**
 * Created by rafa on 13/03/2017.
 */
angular.module('checklist')
  .controller('PosDialogCtrl', ['$state', '$http', '$mdDialog', '$mdToast','PositionsService', 'positions', function ($state, $http, $mdDialog, $mdToast, PositionsService, positions) {
    var vm = this;

    var showToast = function(message) {
      $mdToast.show({
        hideDelay   : 3000,
        position    : 'top right',
        controller  : 'ToastCtrl',
        templateUrl : '/components/Toasts/employees/remove-toast-tmpl.html',
        locals: { message: message }
      });
    };

    vm.change = positions.change;
    if(vm.change){
      vm.pos = positions.pos;
    } else {
      vm.pos = '';
    }

    vm.addDept = function (name) {
      var data =  { position: name };
      PositionsService.create(data).$promise
        .then(function (resp) {
          showToast(resp.message);
          $mdDialog.hide();
          $state.transitionTo($state.current, $state.params, {
            reload: true, inherit: false
          });
        })
        .catch(function (err) {
          showToast("Ошибка");
          $mdDialog.hide();
        })
    };

    vm.putDept = function (name) {
      var data = { position: name };
      PositionsService.update({ id: positions.id }, data).$promise
        .then(function (resp) {
          showToast(resp.message);
          $state.transitionTo($state.current, $state.params, {
            reload: true, inherit: false
          });
          $mdDialog.hide();

        })
        .catch(function (err) {
          showToast("Ошибка");
          $state.transitionTo($state.current, $state.params, {
            reload: true, inherit: false
          });
          $mdDialog.hide();
        })
    };

    vm.cancel = function () {
      $mdDialog.cancel('Cancel Adding user');
    };


  }]);
