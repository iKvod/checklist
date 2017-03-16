/**
 * Created by rafa on 13/03/2017.
 */
angular.module('checklist')
  .controller('EmployeeDialogCtrl', ['$http','$state','$mdDialog','$mdToast', 'EmployeesService', 'dpts', 'positions','botIds', function ($http, $state, $mdDialog, $mdToast, EmployeesService, dpts, positions, botIds) {
      var vm = this;

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

        vm.createUser = function (user) {
          EmployeesService.create(user)
            .$promise
            .catch(function (err) {
              if(err){
                vm.showToast(err.data.message);
                $mdDialog.hide();
                $state.transitionTo($state.current, $state.params, {
                  reload: true, inherit: false
                });
              }
            })
            .then(function (resp) {
              vm.regBotId(vm.user.botId);
              //$mdDialog.hide();
              console.log(resp);
              vm.showToast(resp.data.message);
              $state.transitionTo($state.current, $state.params, {
                reload: true, inherit: false
              });
            });

          // $http({
          //   method: 'POST',
          //   url:'/api/users',
          //   headers: {
          //     'Content-Type': 'application/json'
          //   },
          //   data: user
          // })
          //   .then(function (resp) {
          //     $mdDialog.hide(user);
          //     vm.showToast('Новый сотрудник добавлен в базу!');
          //     $state.transitionTo($state.current, $state.params, {
          //       reload: true, inherit: false
          //     });
          //   }, function (err) {
          //     $mdDialog.hide(user);
          //     console.log("Error " + err);
          //     vm.showToast("Ошибка при сохранений нового пользователя");
          //     $state.transitionTo($state.current, $state.params, {
          //       reload: true, inherit: false
          //     });
          //   })
        };

  }]);