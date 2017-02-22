'use strict';

angular.module('checklist')
	.controller('ReportCtrl', ['$state', '$stateParams', 'ReportingService', '$popover', function ($state, $stateParams, ReportingService, $popover) {
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
                    var obj = {};

                    //console.log(data);

                    for(var i = 0, len = data.length; i < len; ++i){
                        //vm.name.push(data[i].username);
                        vm.name = data[i].username;
                        obj.name = vm.name;

                        for (var j = 0, len2 = data[i].reportminutes.length; j < len2; ++j){

                            // var date = new Date(data[i].reportminutes[j].check_in);
                            // vm.date.push(date.getDate());
                            vm.reportMinutes.push(data[i].reportminutes[j].report.totalTimeInMinutes);
                        }

                        obj.report = vm.reportMinutes;
                        vm.report.push(obj);
                        vm.reportMinutes = [];
                        obj = {};
                        vm.name = '';
                    }


                }, function (err) {
                    console.log(err);
                })
        };
		vm.getPersonalInfo = function (data) {
            console.log(data);
        };

	}]);


