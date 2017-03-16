/**
 * Created by rafa on 10/03/2017.
 */
angular.module('checklist')
  .controller('EmployeeArchCtrl', ['$state', '$http', 'archivedUsers', '$mdDialog', '$mdToast', function ($state, $http, archivedUsers, $mdDialog, $mdToast) {
    var vm = this;

    // vm.customFullScreen = false;
    vm.archUsers = archivedUsers;
    
    vm.rehireEmpl = function (user_id) {
      $http(
        {
          method: 'PUT',
          url: '/api/users/rehire/' + user_id
        }
      ).then(function (resp) {
        vm.showToast('Пользователь восстановлен из архива');
        $state.transitionTo($state.current, $state.params, {
          reload: true, inherit: false
        });
      }, function (err) {
        vm.showToast(err.message);
      })
    };
    vm.showToast = function(message) {
      $mdToast.show({
        hideDelay   : 3000,
        position    : 'top right',
        controller  : 'ToastCtrl',
        templateUrl : '/components/Toasts/employees/remove-toast-tmpl.html',
        locals: {message: message}
      });
    };

    vm.removeEmpl = function(user_id){
        console.log(user_id + " removed!");

      $http({
          method: 'DELETE',
          url: '/api/users/perm/' + user_id,
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(function (resp) {
            vm.showToast('Пользователь удален с базы!');
            $state.transitionTo($state.current, $state.params, {
              reload: true,
              inherit: false
            });

          }, function (err) {
            vm.showToast('Ошибка при удалений');
            console.log(err);
          })
    };

    // archiving user
    // vm.archiveEmployee = function(user_id) {
    //   $http({
    //     method: 'PUT',
    //     url: '/api/users/fire/' + user_id
    //   }).then(function (resp) {
    //     console.log(resp);
    //     // $state.go('admin.employees');
    //     console.log($state.current);
    //     $state.transitionTo($state.current, $state.params, {
    //       reload: true, inherit: false
    //     });
    //
    //   }, function (err) {
    //     console.log(err);
    //   });
    //   console.log(user_id);
    // };
    //
    // vm.addEmployee = function(ev){
    //   $mdDialog.show( {
    //     templateUrl: '/components/admin_panel/Dialogs/employees/addemployee.tmpl.html',
    //     controller: EmployeeDialogCtrl1,
    //     controllerAs: 'vm',
    //     parent: angular.element(document.body),
    //     targetEvent: ev,
    //     clickOutsideToClose: true,
    //     fullscreen: vm.customFullScreen
    //   })
    //     .then(function (resp) {
    //       console.log(resp);
    //
    //     }, function (resp) {
    //       console.log(resp);
    //       //cancelling
    //     })
    // };
    //
    // var EmployeeDialogCtrl1 = function ($mdDialog) {
    //   var vm = this;
    //
    //   vm.cancel = function () {
    //     $mdDialog.cancel('Cancel Adding user');
    //   }
    // }

  }]);