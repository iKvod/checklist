/**
 * Created by rafa on 02/03/2017.
 */
'use strict';

angular.module('checklist')
	.factory('SalaryService', ['$resource', function ($resource){
		var salaryReport = {};

		salaryReport.getSalaryReports = function(){

			return $resource('/api/salary', {id:'@id'}, {
				get: {
						method: "GET",
						params: {"id":"@id"},
						isArray: true,
						cache: false
				}
			});

		};

    return salaryReport;

	}]);