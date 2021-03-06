/**
 * Created by rafa on 06/03/2017.
 */
(function(angular, undefined) {
  angular.module('checklist')
    .controller('EmployeesCtrl', ['$state', '$http','$resource', 'users', '$mdDialog', '$mdToast','EmployeesService',function ($state, $http, $resource, users, $mdDialog, $mdToast, EmployeesService) {
      var vm = this;
      vm.customFullScreen = false;
      vm.users = users;

      vm.showToast = function (message) {
        $mdToast.show({
          hideDelay: 3000,
          position: 'top right',
          templateUrl: '/components/Toasts/employees/remove-toast-tmpl.html',
          controller: 'ToastCtrl',
          locals: {message: message}
        });
      };

      // archiving user
      vm.archiveEmployee = function (user_id) {
        $http({
          method: 'PUT',
          url: '/api/users/fire/' + user_id
        }).then(function (resp) {
          $state.transitionTo($state.current, $state.params, {
            reload: true, inherit: false
          });
          vm.showToast('Данные пользователя размещены в архив');
        }, function (err) {
          vm.showToast('Ошибка при размещенний данных в архив');

        });
      };

      vm.addEmployee = function (ev) {
        $mdDialog.show({
          templateUrl: '/components/admin_panel/Dialogs/employees/addemployee.tmpl.html',
          controller: 'EmployeeDialogCtrl',
          controllerAs: 'vm',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true,
          fullscreen: vm.customFullScreen,
          locals:{
            // dpts: dpts,
            // positions: positions
          },
          resolve: {
            dpts: function (DepartmentsService) {
              return DepartmentsService.getAll().$promise;
            },
            positions: function (PositionsService) {
              return PositionsService.getAll().$promise;
            },
            botIds: function ($resource) {
              var getAll = $resource('/api/users/d');
              return getAll.query().$promise;
            }
          }
        })
          .then(function (resp) {

          }, function (resp) {
            //cancelling
          })
      };

      vm.changeInfo = function(ev, user_id){
        $mdDialog.show({
          templateUrl: '/components/admin_panel/Dialogs/employees/changeempl.tmpl.html',
          controller: 'ChangeemplDialogCtrl',
          controllerAs: 'vm',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true,
          fullscreen: vm.customFullScreen,
          locals:{
            // dpts: dpts,
            // positions: positions
          },
          resolve: {
            dpts: function (DepartmentsService) {
              return DepartmentsService.getAll().$promise;
            },
            positions: function (PositionsService) {
              return PositionsService.getAll().$promise;
            },
            user: function () {
              return users.find(function (el, index, users) {
                return el._id === user_id;
              });
            }
          }
        })
        .then(function (resp) {

        }, function (resp) {
          //cancelling
        })
      }

      // Dummy request
      vm.rehireAll = function () {
        $http(
          {
            method: "POST",
            url: '/api/dummy/fire',
            headers: {
              'Content-Type': 'application/json'
            },
            data: {}
          }
        )
          .then(function (resp) {
            console.log(resp);
          }, function (err) {
            console.log(err);

          })
      }


    }]);
})(angular);