'use strict';

angular.module('checklist')
	.controller('ReportCtrl', ['$state', '$stateParams', 'ReportingService', function ($state, $stateParams, ReportingService) {
		var vm = this;
		vm.tableNames = ['Ф.И.О', 'Фикса'];
		vm.report = [];

		vm.name = 'NULL';
		vm.date = null;


		vm.getReports = function () {
            var reports = ReportingService.getReports();

            reports.get()
				.$promise
                .then(function (data) {
                	vm.report = data;
                    console.log(vm.report);

                    vm.name = data[0].firstname + " " + data[0].lastname;

					for(var i = 0, len = date[0].report.length; i < len; ++i){
						calcTime()
					}

                }, function (err) {
                    console.log(err);
                })
        };

	}]);

var calcTime = function (check_in, check_out, go_out, come_back,lunch_in, lunch_out, callback) {

    var fullTimeHours = null;
    var fullTimeMinutes = null;
    var totalTimeInMinutes = null;
    var fullTimeMilliseconds = null;
    var outWorkMinutes = null;
    var lunchTimeMinutes = null;
    var dateReporting = {};

    if(this.check_in && this.check_out){
        console.log(this.check_in);
        console.log(this.check_out);
        fullTimeHours =
            check_out.getHours() - check_in.getHours();
        fullTimeMinutes = (check_out.getHours() * 60 + check_out.getMinutes())
            - (check_in.getHours() * 60 + check_in.getMinutes());
        //fullTimeMilliseconds = this.check_out.getMilliseconds() - this.check_in.getMilliseconds();

        if (go_out && come_back){
            outWorkMinutes = (come_back.getHours() * 60 + come_back.getMinutes())
                - (go_out.getHours() * 60 + go_out.getMinutes());
        }

        if(lunch_in && lunch_out){
            lunchTimeMinutes = (lunch_out.getHours() * 60 + lunch_out.getMinutes())
                - (lunch_in.getHours() * 60 + lunch_in.getMinutes());
        }

        totalTimeInMinutes = fullTimeMinutes - outWorkMinutes - lunchTimeMinutes;
        console.log("Get interval in hours: "+ fullTimeHours);
        console.log("Get interval in min: " + fullTimeMinutes);

        dateReporting =  {
            minutes : fullTimeMinutes, // whole time begiin
            lunchTime : lunchTimeMinutes,
            outWorkDW : outWorkMinutes,
            totalTimeInMinutes: totalTimeInMinutes
        };
        callback(dateReporting);
    } else {
        console.log("Вы не сделали чекаут!");
        console.log(check_in  + check_out);
        console.log(check_out);

    }
};


