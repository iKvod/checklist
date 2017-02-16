'use strict';

angular.module('checklist')
	.controller('ReportCtrl', ['$state', '$stateParams', 'ReportingService', function ($state, $stateParams, ReportingService) {
		var vm = this;
		vm.reportMinutes = [];

		vm.name = 'NULL';
		vm.date = null;


		vm.getReports = function () {
            var reports = ReportingService.getReports();

            reports.get()
				.$promise
                .then(function (data) {
                	console.log(data);
                }, function (err) {
                    console.log(err);
                })
        };

	}]);


