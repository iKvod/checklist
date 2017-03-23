/**
 * Created by rafa on 21/03/2017.
 */
angular.module('checklist')
  .controller('ChangeemplDialogCtrl', ['$http','$mdToast', '$mdDialog',
    'EmployeesService', 'dpts', 'positions','botIds', 'user',
    function ($http, $mdToast, $mdDialog, EmployeesService, dpts, positions, botIds, user) {
      var vm = this;
      console.log(user);
      vm.user = {
        firstname: user.firstname,
        lastname: user.lastname,
        department: user.department,
        position: user.position,
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
      console.log(dpts);
      vm.positions = positions;
      vm.botInfo = botIds;
      vm.cancel = function () {
        $mdDialog.cancel();
      };
      var ok = true;
      vm.getId = function(dept){
        console.log(dept);
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
              console.log(vm.user.employee_id);
              // ok = false;
              vm.showToast("ID сгенирировано - " + vm.user.employee_id);
            }, function (err) {
              vm.showToast("ID Не сгенирировано. " + err.data.message)
            })
        }
      };



      var botid = null;
      vm.getBotId = function(){
        console.log(vm.botInfo.length);
        botIds.$promise
          .catch(function (err) {
            console.log(err);
          })
          .then(function (resp) {
            var mess = '';
            if(vm.botInfo.length){

              for(var i = 0, len = resp.length; i < len; i++){
                mess += " Бот ID: " + resp[i].botid + " Уникальный код: " + resp[i].counter + " ";
              }

            }
            customToast(7000, mess ? mess : 'Сотрудник не зарегистрирован в Телеграм боте', mess ? '#content' : 'body');
            if(!mess){
              $mdDialog.hide();
            }

          });
      };

      vm.specPosition = null;
      vm.getPositions = function (department) {
        var dptId = vm.dpts.find(function (el, index, users) {
          return el.department === department;
        });
        $http({
            method: 'GET',
            url: '/api/departments/position/' + dptId
          })
          .then(function (resp) {
            vm.specPosition = resp;
            console.log(resp);
          }, function (err) {
            console.log(err);
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
        console.log(user);
        // EmployeesService.create(user)
        //   .$promise
        //   .catch(function (err) {
        //     if(err){
        //       vm.showToast(err.data.message);
        //       $mdDialog.hide();
        //       $state.transitionTo($state.current, $state.params, {
        //         reload: true, inherit: false
        //       });
        //     }
        //   })
        //   .then(function (resp) {
        //     vm.regBotId(vm.user.botId);
        //     //$mdDialog.hide();
        //     console.log(resp);
        //     vm.showToast(resp.data.message);
        //     $state.transitionTo($state.current, $state.params, {
        //       reload: true, inherit: false
        //     });
        //   });
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