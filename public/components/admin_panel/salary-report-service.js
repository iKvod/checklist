/**
 * Created by rafa on 02/03/2017.
 */
'use strict';

angular.module('checklist')
	.factory('SalaryService', ['$resource', function ($resource){
		var salaryReport = {};

		salaryReport.getSalaryReports = function(){

      return $resource('/api/salary/monthly/:id', { id: '@id'}, {
        create: { method: 'POST' },
        getAll: { method: 'GET', isArray: false },
        getOne: {
          method: 'GET',
          params: {'id': '@id'}
        },
        update: {
          method: 'PUT',
          params: { "id":"@id" },
          isArray: false,
          cache: false
        },
        deleteAll: {method: 'DELETE'},
        deleteOne: {
          method: 'DELETE',
          params: {'id': '@id'}
        }
      });

		};

    return salaryReport;

	}]);