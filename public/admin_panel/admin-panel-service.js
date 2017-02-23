'use strict';

angular.module('checklist')
    .factory('ReportingService', ['$resource', function ($resource) {
        var adminFac = {};

        adminFac.getReports = function () {
          return $resource('/api/reports/:id', {id:'@id'},{
              get : {
                  method:"GET",
                  params:{"id":"@id"},
                  isArray: true,
                  cache: false
              }
          })
        };

        return adminFac;

    }]);
