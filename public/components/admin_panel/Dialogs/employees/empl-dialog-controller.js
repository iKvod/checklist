/**
 * Created by rafa on 13/03/2017.
 */
'use strict';

angular.module('checklist')
  .controller('EmployeeDialogCtrl', ['$http','$state','$mdDialog','$mdToast', 'EmployeesService', 'dpts','botIds', 'positions',
    function ($http, $state, $mdDialog, $mdToast, EmployeesService, dpts, botIds, positions) {
      var vm = this;

      console.log(dpts);
      vm.user = {
        firstname: null,
        lastname: null,
        department: null,
        position: null,
        botId: null,
        employee_id: null,
        work_time: null,
        salary_fixed: null,
        bonus: null,
        phonenumber: null,
        email: null
      };

      vm.dpts = dpts;
      vm.botInfo = botIds;


      vm.specPositions = null;
      vm.getSpecPos = function (department) {
        if(department) {
          var dptId = vm.dpts.find(function (el, index, users) {
            return el.department === department;
          });
          $http({
            method: 'GET',
            url: '/api/depts/position/' + dptId._id
          })
            .then(function (resp) {
              vm.specPositions = resp.data.positions;
            }, function (err) {

            })

        } else  {
          customToast(3000, 'Выберите сначало департамент', 'body');
        }

      };
    //generates new ID according to department
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
              console.log(vm.user.employee_id);
              // ok = false;
              vm.showToast("ID сгенирировано - " + vm.user.employee_id);
            }, function (err) {
              vm.showToast("ID Не сгенирировано. " + err.data.message)
            })
        }
      };

      //get's bot id for users if they have already registred
      var botid = null;
      vm.getBotId = function(){
        console.log(vm.botInfo.length);
        botIds.$promise
          .catch(function (err) {
            console.log(err);
          })
          .then(function (resp) {
            console.log(resp);
            var mess = ''; // if candidates registred simultaneusly message will be displayed
            console.log(mess);
            if(vm.botInfo.length){

              for(var i = 0, len = resp.length; i < len; i++){
                mess += " Бот ID: " + resp[i].botid + " Уникальный код: " + resp[i].counter + " ";
              }

            }
            customToast(7000, mess ? mess : 'Сотрудник не зарегистрирован в Телеграм боте. Попросите его, чтобы зарегистрировался', mess ? '#content' : 'body');
            if(!mess){
              // $mdDialog.hide();
            }

          });
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
              // customToast(4000, resp.data.message, 'body');
              //vm.showToast('Зарегистрирован');
            }, function (resp) {
              customToast(2000, resp.data.message, 'body');
            })
        } else {
          vm.showToast('Что то пошло не так');
        }
      };

      vm.createUser = function (user) {
        user.position_id = positions.find(function (el) {
          if(el.position === user.position) {
            return el._id;
          }
        })._id;
        user.department_id = vm.dpts.find(function (el, index, dpts) {
          if(el.department === user.department){
            return el._id;
          }
        })._id;
        EmployeesService.create(user)
          .$promise
          .catch(function (err) {
            if(err){
              console.log(err.data.message)
              if(err){
                vm.showToast(err.data.message);
                $state.transitionTo($state.current, $state.params, {
                  reload: true, inherit: false
                });

              }
              // $mdDialog.hide();
            }
          })
          .then(function (resp) {
            vm.regBotId(vm.user.botId);
            //$mdDialog.hide();
            vm.showToast(resp.data.message);
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

      vm.cancel = function () {
        $mdDialog.cancel();
      };

  }]);