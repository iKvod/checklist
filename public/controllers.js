'use strict';

angular.module('checklist')
    .controller('MainCtrl', ['$mdSidenav', function($mdSidenav){
        var vm = this;

        vm.toggleSidenav = function(left){
            $mdSidenav(left).toggle();
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
    .controller('ChecklistCtrl', ['ChecklistService', '$state','$stateParams', '$rootScope',
     function(ChecklistService, $state, $stateParams, $rootScope){
       var vm = this;
    //vm.user = user;
       vm.employee_id = '';
       vm.message = '';

  /*     // bad solution. check by id if he/she checked
       vm.checkChecked = function(id){
            vm.employee_id = id;
            for ( var i = 0, len = user.length; i < len; ++i){
                if((id === user[i].employee_id)){
                    $rootScope.employee_id = id;
                    if(!user[i].checked){
                        $state.go('checkin.code');
                        //$stateParams({id: })
                    } else {
                        $state.go('checkout.code');
                    }

                } else {
                   vm.message = "You're not registered or provided bad ID. Try again";
                   $state.go('checklist')
                }
            }
       }*/

       vm.checkChecked = function(id){ 
           
            var userData = ChecklistService.get({id:id});
            userData.$promise.then(
                function(data){
                   console.log(data);
                    if(data.checked){
                        $rootScope.id = data._id;
                        $state.go('checkout', { employee_id: data._id });
                    } else {
                        $rootScope.id = data._id;
                        $state.go('checkin', { employee_id: data._id });
                    }
            }, function(err){
                console.log(err);
            });
       }
    }])
    .controller('CheckinCtrl',
        ['$state','$stateParams','$http', '$rootScope','CheckinService','WebcamService', function($state,$stateParams, $http, $rootScope, CheckinService, WebcamService){
            var vm = this;
            vm.greeting = "Добро пожаловать! Отметтесь пожалуйста";
            vm.data = { message: "Пришел(пришла) на работу", id: $stateParams.employee_id};

            //WEBCAM snacpshot taking
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
            
            //sending captured image to the server/bot 
            vm.sendData = function(image){   
                $http({
                    url:'/api/bot/image',
                    method: 'POST',
                    data: {image:image, report: vm.data}
                })
                .then(function(response){
                    console.log(response);
                }, function (error) {
                    console.log(error);
                });   
            };


            vm.checkIn = function(code){
                console.log(code);
                var id = $stateParams.employee_id;
                console.log(id);
                var checkin = CheckinService.query({id:id});

                checkin.$promise
                    .then(
                        function(data){
                            console.log(data);
                            $state.go('checkin.image', {employee_id: data._id});


                    },  function(err){
                            console.log(err);
                    });
            };
            
    }])
    .controller('CheckoutCtrl', ['$state', '$http','$stateParams', 'CheckoutService', 'WebcamService', 
        function($state, $http, $stateParams, CheckoutService, WebcamService){
        var vm = this;
        vm.greeting = "Hello! Checkout, please!!"
        vm.data = { message: "Уходит с работы!", id: $stateParams.employee_id, report:'', bookreport:''};

        
        //WEB CAM 
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


        vm.checkOut = function(code){
            console.log("Checkout code: " + code);
            var id = $stateParams.employee_id; 

            var checkOut = CheckoutService.query({id:id});

            checkOut.$promise
                .then(function(data){
                    console.log($stateParams.employee_id);
                    $state.go('checkout.image', {reload:true});
                }, function(err){
                    console.log(err);
                });
        }

        vm.sendData = function(image, report, reportBook){
                vm.data.report = report;
                vm.data.bookreport = reportBook;    
                $http({
                    url:'/api/bot/image',
                    method: 'POST',
                    data: {image:image, report: vm.data}
                })
                .then(function(response){
                    console.log(response);
                }, function (error) {
                    console.log(error);
                });   
        }

    }]);

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
    })*/

