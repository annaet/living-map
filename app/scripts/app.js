'use strict';

/**
 * @ngdoc overview
 * @name livingMapApp
 * @description
 * # livingMapApp
 *
 * Main module of the application.
 */
angular
  .module('livingMapApp', [
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
