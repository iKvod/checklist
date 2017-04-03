/**
 * Created by rafa on 13/03/2017.
 */
angular.module('checklist')
  .controller('DptsDialogCtrl', ['$state', '$http', '$mdDialog', '$mdToast','DepartmentsService', 'depts', function ($state, $http, $mdDialog, $mdToast, DepartmentsService, depts) {
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

    vm.change = depts.change;
    if(vm.change){
      vm.dept = depts.dpt;
    } else {
      vm.dept = '';
    }

    vm.addDept = function (name) {
      var data =  { dept: name };
      DepartmentsService.create(data).$promise
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
      var data = { dept: name };
      DepartmentsService.update({ id: depts.id }, data).$promise
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
