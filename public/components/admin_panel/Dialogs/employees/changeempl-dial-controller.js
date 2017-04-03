/**
 * Created by rafa on 21/03/2017.
 */
angular.module('checklist')
  .controller('ChangeemplDialogCtrl', ['$http','$mdToast', '$mdDialog',
    'EmployeesService', 'dpts', 'positions', 'user',
    function ($http, $mdToast, $mdDialog, EmployeesService, dpts, positions, user) {
      var vm = this;
      vm.user = {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        department: user.department ? user.department.department : user.department,
        position: user.position ? user.position.position : user.position ,
        botId: user.botId,
        employee_id: user.employee_id,
        work_time: user.work_time,
        salary_fixed: user.salary_fixed,
        bonus: user.bonus,
        phonenumber: user.phonenumber,
        email: user.email,
        admin: user.admin,
        disabled: user.disabled
      };

      vm.dpts = dpts;
      vm.positions = positions;
      vm.cancel = function () {
        $mdDialog.cancel();
      };
      var ok = true;
      vm.getId = function(dept){
        if(ok){
          $http(
            {
              method: "POST",
              url: '/api/generators/idgen',
              headers: {
                'Content-Type': 'application/json'
              },
              data: { dept: dept }
            }
          )
            .then(function (resp) {
              // console.log(resp);
              vm.user.employee_id = resp.data;
              // ok = false;
              vm.showToast("ID сгенирировано - " + vm.user.employee_id);
            }, function (err) {
              vm.showToast("ID Не сгенирировано. " + err.data.message)
            })
        }
      };

      vm.specPosition = null;
      vm.getPositions = function (department) {
        var dptId = vm.dpts.find(function (el, index, users) {
          return el.department === department;
        });
        $http({
            method: 'GET',
            url: '/api/depts/position/' + dptId._id
          })
          .then(function (resp) {
            vm.specPosition = resp.data.positions;
          }, function (err) {

          })
      };

      // change registred to true in employment schema
      vm.regBotId = function (botid) {
        if(botid){
          $http({
            method: "PUT",
            url: '/api/users/bot/' + botid
          })
            .then(function (resp) {
              console.log(resp);
              customToast(4000, resp.data.message, 'body');
              //vm.showToast('Зарегистрирован');
            }, function (resp) {
              customToast(2000, resp.data.message, 'body');
            })
        } else {
          vm.showToast('Что то пошло не так');
        }
      };

      vm.changeUser = function (user) {
        user.position_id = vm.positions.find(function (el) {
          if(el.position === user.position) {
            return el._id;
          }
        })._id;
        user.department_id = vm.dpts.find(function (el, index, dpts) {
          if(el.department === user.department){
            return el._id;
          }
        })._id;
        EmployeesService.update({ id: vm.user.id }, user)
          .$promise
          .catch(function (err) {
            if(err){
              console.log(err);
              vm.showToast(err.data.message);
              $mdDialog.hide();
              $state.transitionTo($state.current, $state.params, {
                reload: true, inherit: false
              });
            }
          })
          .then(function (resp) {
            $mdDialog.hide();
            vm.showToast(resp.message);
            $state.transitionTo($state.current, $state.params, {
              reload: true, inherit: false
            });
          });
      };

      vm.showToast = function(message) {
        $mdToast.show({
          hideDelay   : 3000,
          position    : 'top right',
          controller  : 'ToastCtrl',
          templateUrl : '/components/Toasts/employees/remove-toast-tmpl.html',
          locals: { message: message },
          parent: angular.element(document.querySelectorAll('body'))
        });
      };

      var customToast = function (time, message, element) {
        $mdToast.show({
          hideDelay   : time,
          position    : 'top right',
          controller  : 'ToastCtrl',
          templateUrl : '/components/Toasts/employees/remove-toast-tmpl.html',
          locals: {message: message},
          parent: angular.element(document.querySelectorAll(element))
        });
      };

    }]);