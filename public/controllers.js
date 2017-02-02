'use strict';

angular.module('checklist')
    .controller('MainCtrl', ['$mdSidenav', function($mdSidenav){
        var vm = this;

        vm.toggleSidenav = function(){
            $mdSidenav('left').toggle();
        }

        var list = [];
          for (var i = 0; i < 100; i++) {
            list.push({
              name: 'List Item ' + i,
              idx: i
            });
          };
         vm.list = list;

    }])
    .controller('ChecklistCtrl', ['ChecklistService', 'CheckinService', '$state', 'user','$stateParams', '$rootScope',
     function(ChecklistService, CheckinService, $state, user, $stateParams, $rootScope){
       var vm = this;
       vm.user = user;
       vm.employee_id = '';
       vm.message = '';
       //console.log($state);

       // bad solution. check by id if he/she checked
       // vm.checkChecked = function(id){
       //      vm.employee_id = id;
       //      for ( var i = 0, len = user.length; i < len; ++i){
       //          if((id === user[i].employee_id)){
       //              $rootScope.employee_id = id;
       //              if(!user[i].checked){
       //                  $state.go('checkin.code');
       //                  //$stateParams({id: })
       //              } else {
       //                  $state.go('checkout.code');
       //              }

       //          } else {
       //             vm.message = "You're not registered or provided bad ID. Try again";
       //             $state.go('checklist')
       //          }
       //      }
       // }

       vm.checkChecked = function(id){
            // CheckinService.get({id: id})
            // .$promise.then(function(employee){
            //     console.log(employee);
            //     $state.go('checkin.code');
            // });
            // CheckinService.get({id:id}, function(err, data){
            //     console.log(err);
            //     console.log(data);
            // })
            var data = CheckinService.query({id:id})
            data.$promise.then(function(data){
                console.log(data);
                //$rootScope.
                if(data[0].checked){
                    $rootScope.id = data[0]._id;
                    //expect($stateParams).toBe({employee_id: data[0].botId})
                    $state.go('checkin.code');
                } else {
                    $rootScope.id = data[0]._id;
                    //expect($stateParams).toBe({employee_id: data[0].botId})
                    //$state.go('checkout.code', {employee_id: datap[0]._id});                      
                }
            });
           // console.log(CheckinService);
       }

    }])
    .controller('CheckinCtrl',
        ['$state','$stateParams','$http', '$rootScope',function($state,$stateParams, $http, $rootScope){
            var vm = this;
            vm.greeting = "Hello! Checkin, please!!"
            vm.employee_id = '';
            var data  = {};
        console.log($rootScope.employee_id);

            // vm.sendId = function(id) {
            //     //console.log(id);
            //     console.log($rootScope.employee_id);
            //     $http({
            //         url: '/api/checklist/checkin',
            //         method: "POST",
            //         data: { 'employee_id' : id }
            //     })
            //     .then(
            //         function(response) {
            //             //console.log(response);
            //             vm.botId = response.data[0].botId;
            //             console.log(response.data[0].checked);
            //             if(response.data[0].checked){
            //                 vm.checked = response.data[0].checked;
            //                 $state.go(".code");
            //                 console.log(vm.checked); 

            //             } else {
            //                 vm.checked = response.data[0].checked;
            //                 $state.go(".code");
            //                 console.log(vm.checked); 
            //                // $state.go("checkout.code", response);
            //             }
            //           //$state.go(chechin.code, {}, {reload: true});
            //     }, 
            //         function(response) { // optional
            //                 console.log('ERROR ' + response);
            //         });
            // };



            vm.sendCode = function(code){
                console.log("Your code is " +  code);
                console.log(vm.checked);
                console.log(vm.botId);

                $http({
                    url: '/api/checklist/code',
                    method: 'POST',
                    data: { 
                        'code': code,
                        'checked' : vm.checked,
                        'botId' : vm.botId
                    }
                })
                .then(function(response){
                    console.log(response);
                    $state.go('image');
                }, function(error){
                    console.log(err);
                });
            };
    }])
    .controller('CheckoutCtrl', ['$state', '$rootScope', function($state, $rootScope){
        var vm = this;
        console.log($rootScope.employee_id);

        vm.greeting = "Hello! Checkout, please!!"



    }])
    .controller('WebcamCtrl', 
         ['$state','$stateParams','$http', 'WebcamService', function($state,$stateParams, $http,WebcamService){
            var vm = this;
            vm.report = '';

            vm.showweb = true;
            vm.webcam = WebcamService.webcam;
            //override function for be call when capture is finalized
            vm.webcam.success = function(image, type) {
                vm.photo = image;
                vm.fotoContentType = type;
                vm.showweb = false;
            };

            function turnOffWebCam() {
                if(vm.webcam && vm.webcam.isTurnOn===true)
                    vm.webcam.turnOff();
            }
            //sending captured image to the server 
            vm.sendData = function(image){   
                $http({
                    url:'/api/bot/image',
                    method: 'POST',
                    data: {image:image, report: vm.report}
                })
                .then(function(response){
                    console.log(response);
                }, function (error) {
                    console.log(error);
                });   
            }

    }])

    /*.directive('fileModel', funciton($parse, $http){
        return {
            restrict: "A",
            scope: {
                fileupload: '='
            },
            link: function(scope, element, attrs){

                var file = element[0].files[0];
                var reader = new FileReader();
                reader.readAsDatURL(file);

                reader.onloadend = function(){
                    $http.post('/upload', {
                        name: file.name,
                        data: reader.result
                    });
                }
            }
        }
    })*/;

