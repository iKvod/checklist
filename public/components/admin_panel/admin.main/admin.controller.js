/**
 * Created by rafa on 06/03/2017.
 */
angular.module('checklist')
  .controller('AdminCtrl', ['$state', function ($state) {
    var vm = this;
    vm.num = null;
    // vm.show = { 1 : false, 2: false, 3:false};

    vm.setTab = function (num) {
      vm.num = num;
      if(num === 1){
        // vm.show[1] = true;
        $state.go('admin.reports');
      } else if(num === 2 ){
        // vm.show[2] = true;
        $state.go('admin.employees');
      } else if(num === 3 ){
        // vm.show[3] = true;
        $state.go('admin.settings');
      } else {
        $state.go('fun');
      }
    }

  }]);