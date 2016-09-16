'use strict';

/**
 * @ngdoc function
 * @name livingMapApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the livingMapApp
 */
angular.module('livingMapApp')
  .controller('MainCtrl', function ($scope, $window) {
     var L = $window.L;

    var map = L.map('lm-map');
    map.setView([51.505, -0.09], 13);

    var esriStreets = L.esri.basemapLayer('DarkGray').addTo(map);

    angular.element(document).ready(function () {
      map.invalidateSize();
    });
  });
