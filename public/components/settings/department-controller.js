/**
 * Created by rafa on 13/03/2017.
 */

angular.module('checklist')
  .controller('DepartmentsCtrl', ['$state', '$http', 'users', '$mdDialog', '$mdToast', function ($state, $http, users, $mdDialog, $mdToast) {
    var vm = this;
    vm.customFullScreen = false;
    vm.users = users;

    vm.showToast = function(message) {
      $mdToast.show({
        hideDelay   : 3000,
        position    : 'top right',
        controller  : 'ToastCtrl',
        templateUrl : '/components/Toasts/employees/remove-toast-tmpl.html',
        locals: {message: message}
      });
    };

  }]);
