/**
 * Created by rafa on 07/03/2017.
 */
angular.module('checklist')
  .controller('SalaryCtrl', ['$http', '$mdDialog', function ($http, $mdDialog) {
    var vm = this;
    vm.month = null;
    vm.customFullScreen = true;

    vm.salaryReport = null;
    
    
    vm.getSalaryCurrentMonth = function () {

    };


    vm.showCallendar = function (ev) {
      $mdDialog.show( {
        templateUrl: '/components/admin_panel/Dialogs/callendar/callendar.tmpl.html',
        controller: CallendarCtrl,
        controllerAs: 'vm',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        fullscreen: vm.customFullScreen
      })
        .then(function (resp) {
        }, function (resp) {
          console.log(resp);
          //cancelling
        })
    };

    function CallendarCtrl($mdDialog, $scope) {
      $scope.setMonth = function(monthStr){
        switch (monthStr){
          case 'Янв.':
            vm.month = 1;
            $mdDialog.hide(vm.month);
            break;
          case 'Фев.':
            vm.month = 2;
            break;
          case 'Мар.':
            vm.month = 3;
            break;
          case 'Апр.':
            vm.month = 4;
            break;
          case 'Май.':
            vm.month = 5;
            break;
          case 'Июн.':
            vm.month = 6;
            break;
          case 'Июл.':
            vm.month = 7;
            break;
          case 'Авг.':
            vm.month = 8;
            break;
          case 'Сен.':
            vm.month = 9;
            break;
          case 'Окт.':
            vm.month = 10;
            break;
          case 'Ноя.':
            vm.month = 11;
            break;
          case 'Дек.':
            vm.month = 12;
            break;
          default:
            break;
        }
      };

      $scope.cancel = function() {
        $mdDialog.cancel('cancelling....');
      };

    }

  }]);