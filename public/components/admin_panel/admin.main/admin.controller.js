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
        console.log(num);
      } else if(num === 2 ){
        $state.go('admin.employees');
        console.log(num);

      } else if(num === 3 ){
        $state.go('admin.settings');
        console.log(num);

      } else {
        $state.go('fun');
        console.log(num);

      }
    }

  }]);
