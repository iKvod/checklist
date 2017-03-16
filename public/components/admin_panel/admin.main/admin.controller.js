/**
 * Created by rafa on 06/03/2017.
 */
angular.module('checklist')
  .controller('AdminCtrl', ['$state', function ($state) {
    var vm = this;
    vm.num = null;

    vm.setTab = function (num) {
      vm.num = num;
      if(num === 1){
        $state.go('admin.reports');
      } else if(num === 2 ){
        $state.go('admin.employees');
      } else if(num === 3 ){
        $state.go('admin.settings');
      } else {
        $state.go('fun');
      }
    }

  }]);
