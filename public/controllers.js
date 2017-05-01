'use strict';

angular.module('checklist')
    .controller('ChecklistCtrl', ['ChecklistService', '$state','$stateParams', '$rootScope', '$timeout',
     function(ChecklistService, $state, $stateParams, $rootScope, $timeout){
       var vm = this;
    //vm.user = user;
       vm.employee_id = '';
       vm.errorMessage = '';
        // checks if user checked in or out and redirect to state
       vm.checkChecked = function(emp_id){ 
           var id = emp_id.toLowerCase();
            var userData = ChecklistService.get({id:id});
            userData.$promise.then(
                function(data){
                   console.log(data);
                   $rootScope.name = data.firstname + " " + data.lastname;
                   $rootScope.botId = data.botId;
                   $rootScope.code = data.code;
                   //$rootScope.checked = data.checked;
                    if(data.checked){
                        $rootScope.id = data.id;
                        $state.go('checkout', { employee_id: data._id });
                    } else {
                        $rootScope.id = data.id;
                        $state.go('checkin', { employee_id: data._id });
                    }
            }, function(err){
                // console.log(err.status);
                vm.errorMessage = 'Пользователь не найден!'
                    $timeout(function () {
                        vm.errorMessage = '';
                    }, 1000);
            });
       }
    }])
    .controller('CheckinCtrl',
        ['$state','$stateParams','$http', '$rootScope','CheckinService','WebcamService', 
            function($state,$stateParams, $http, $rootScope, CheckinService, WebcamService){
            var vm = this;
            vm.greeting = "Добро пожаловать! Отметтесь пожалуйста";
            vm.successGreating = "Вы отметились в системе!";
            vm.data = { message: "Пришел(пришла) на работу", 
                        id: $stateParams.employee_id, 
                        name: $rootScope.name,
                        botId: $rootScope.botId
            };

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
                    $state.go('checkin.success');
                    console.log(response);
                }, function (error) {
                    console.log(error);
                });   
            };

            // reports checkin in db
            vm.checkIn = function(code){
                // console.log(code);
                var id = $stateParams.employee_id;
                // console.log(id);
                var checkin = CheckinService.query({id:id});

                checkin.$promise
                    .then(
                        function(data){
                            // console.log("Checkin");
                            // console.log(data);
                            $state.go('checkin.image', {employee_id: data._id});


                    },  function(err){
                            // console.log(err);
                    });
            };
            
    }])
    .controller('CheckoutCtrl', ['$state', '$rootScope','$http','$stateParams', 'CheckoutService', 'WebcamService', 
        function($state, $rootScope, $http, $stateParams, CheckoutService, WebcamService){
        var vm = this;
        vm.greeting = "Здравствуйте, сделайте Checkout!";
        vm.successGreating = "Надеемся день у Вас был плодотворным!";
        vm.data = { 
            message: "Уходит с работы!", 
            id: $stateParams.employee_id, 
            report:'',
            bookreport:'',
            name: $rootScope.name,
            botId: $rootScope.botId
        };
        vm.report = '';

        
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

        //sending checkout report to the server
        vm.checkOut = function(code){
            //console.log("Checkout code: " + code);
            var id = $stateParams.employee_id; 

            var checkOut = CheckoutService.query({id:id});

            checkOut.$promise
                .then(function(data){
                   // console.log($stateParams.employee_id);
                    $state.go('checkout.image', {reload:true});
                }, function(err){
                    console.log(err);
                });
        };

        //sending report to the server and notification to CEO and Pr. Manager
        vm.sendReport  = function (report){
            var id = $stateParams.employee_id;
            vm.report = report;
            var obj = {};
            obj.report = vm.report;
            var reporting = new CheckoutService(obj);
            reporting.$update({id:id})
           
        };

        //sending checkout report to bot
        vm.sendData = function(image, report, reportBook){
                vm.data.report = report;
                vm.data.bookreport = reportBook;    
                $http({
                    url:'/api/bot/image',
                    method: 'POST',
                    data: {image: image, report: vm.data}
                })
                .then(function(response){
                    $state.go('checkout.success');
                    //console.log(response);
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

