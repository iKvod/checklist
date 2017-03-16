/**
 * Created by rafa on 10/03/2017.
 */
/**
 * Created by rafa on 09/03/2017.
 */
'use strict';

angular.module('checklist')
  .factory('EmpArchiveService', ['$resource', function ($resource) {

    return $resource('/api/users/fired');
    // return $resource('/api/checklist/checkout/:id', { id: '@id'}, {
    //   update: {
    //     method: 'PUT',
    //     params:{"id":"@id"},
    //     isArray:false,
    //     cache:false
    //   }
//    return $resource();
    // })


  }]);
