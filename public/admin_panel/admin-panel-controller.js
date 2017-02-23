'use strict';

angular.module('checklist')
	.controller('ReportCtrl', ['$state', '$stateParams', 'ReportingService', '$popover', '$http', '$filter', function ($state, $stateParams, ReportingService, $popover, $http, $filter) {
		var vm = this;

		vm.reportMinutes = [];
		vm.name = '';
        vm.date = [];
        vm.report = [];

        vm.getReports = function () {
            var reports = ReportingService.getReports();

            reports.get()
                .$promise
                .then(function (data) {
                    console.log(data);
                    var obj = {};

                    for(var i = 0, len = data.length; i < len; ++i){
                        //vm.name.push(data[i].username);
                        vm.name = data[i].username;
                        obj.name = vm.name;

                        for (var j = 0, len2 = data[i].reportminutes.length; j < len2; ++j){

                            // var date = new Date(data[i].reportminutes[j].check_in);
                            // vm.date.push(date.getDate());
                            vm.reportMinutes.push(data[i].reportminutes[j].report);
                        }

                        obj.report = vm.reportMinutes;
                        vm.report.push(obj);
                        vm.reportMinutes = [];
                        obj = {};
                        vm.name = '';
                    }
                }, function (err) {
                    console.warn(err);
                })
        };
		vm.getPersonalInfo = function (data, index, user) {
		    console.log(user);
		    $popover(angular.element(document.querySelector('.elem_'+data.minutes+'_'+index+'_'+(data.lunchTime==null?'null':data.lunchTime))), {
		        title: 'Данные за этот день',
                content: '<b>checkin:</b> '+ $filter('date')(data.beginWorkDay, 'shortTime', 'Z')+'<br>' +
                '<b>checkout:</b> '+data.stopWorkDay+'<br>' +
                '<b>ушел на обед: </b>'+data.goLunch+'<br>' +
                '<b>пришел с обеда: </b>'+data.comeFromLunch+'<br>' +
                '<b>ушел на перерыв: </b>' + data.goOut+'<br>'+
                '<b>пришел с перерыва: </b>'+data.comeToWork,
                trigger: 'click',
                autoClose: true,
                html: true,
                animation: 'am-fade-and-scale',
                placement: 'bottom'
            })
                .$promise
                .then(function (data) {
                data.toggle;
            }, function (error) {
                console.warn('error: ', error);
            });
        };

	}]);


