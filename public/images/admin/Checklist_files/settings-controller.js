/**
 * Created by rafa on 06/03/2017.
 */
'use strict';

angular.module('checklist')
  .controller('SettingsCtrl', ['$http','$state','$mdDialog','$mdToast','dpts','positions','DepartmentsService', 'PositionsService', function ($http, $state, $mdDialog, $mdToast, dpts, positions, DepartmentsService, PositionsService) {
    var vm = this;
    vm.dpts = dpts;
    vm.positions = positions;
    vm.customFullScreen = false;
    console.log(dpts);

    var data = { change: false, id: null, dpt: null };
    var dataPos = { change: false, id: null, pos: null };

    /*
    * For departments
    * */
    vm.changeDep = function(dpt_id){
        data.change = true;
        for (var i = 0, len = dpts.length; i < len; i++){
           if(dpts[i]._id === dpt_id){
             data.id = dpt_id;
             data.dpt = dpts[i].department;
           }
        }
    };

    vm.addDpt = function (ev) {
      $mdDialog.show({
        templateUrl: '/components/admin_panel/Dialogs/settings/department/depts.tmpl.html',
        controller: 'DptsDialogCtrl',
        controllerAs: 'vm',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        fullscreen: vm.customFullScreen,
        locals: {
          depts: data
        }
      })
        .then(function (resp) {
        }, function (resp) {
          //cancelling
        })
    };

    vm.deleteDept = function (dept_id) {
      DepartmentsService.deleteOne({ id: dept_id }).$promise
        .then(function (data) {
          showToast(data.message);
          $state.transitionTo($state.current, $state.params, {
            reload: true, inherit: false
          });
        })
        .catch(function (err) {
          showToast(err);
        })
    };

    /*
    * for Positions
    * */
    vm.changePos = function(id){
      dataPos.change = true;
      for (var i = 0, len = positions.length; i < len; i++){
        if(positions[i]._id === id){
          dataPos.id = id;
          dataPos.pos = positions[i].position;
        }
      }
    };

    vm.addPos = function (ev) {
      $mdDialog.show({
        templateUrl: '/components/admin_panel/Dialogs/settings/positions/positions.tmpl.html',
        controller: 'PosDialogCtrl',
        controllerAs: 'vm',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        fullscreen: vm.customFullScreen,
        locals: {
          positions: dataPos
        },
        resolve: {
          departments: function (DepartmentsService) {
            return DepartmentsService.getAll().$promise;
          }
  
        }
      })
        .then(function (resp) {

        }, function (resp) {
          //cancelling
        })
    };

    vm.deletePos = function (pos_id) {
      PositionsService.deleteOne({ id: pos_id }).$promise
        .then(function (data) {
          showToast(data.message);
          $state.transitionTo($state.current, $state.params, {
            reload: true, inherit: false
          });
        })
        .catch(function (err) {
          showToast(err);
        })
    };



    /**
     * Toast service
     * */
    var showToast = function(message) {
      $mdToast.show({
        hideDelay   : 3000,
        position    : 'top right',
        controller  : 'ToastCtrl',
        templateUrl : '/components/Toasts/employees/remove-toast-tmpl.html',
        locals: { message: message }
      });
    };

  }]);