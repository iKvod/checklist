/**
 * Created by rafa on 14/03/2017.
 */
'use strict';

angular.module('checklist')
  .factory('PositionsService', ['$resource', function ($resource) {

    return $resource('/api/positions/:id', { id: '@id'}, {
      create: { method: 'POST' },
      getAll: { method: 'GET', isArray: true },
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
  }]);