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

    L.tileLayer('https://api.mapbox.com/styles/v1/annaet/ciqwdytcm000d1tngmuszvxia/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYW5uYWV0IiwiYSI6ImNpcXdkeTFhdzAwMnBodG5qZnhsa3pwNzgifQ.sLCy6WaD4pURO1ulOFoVCg', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      id: 'annaet',
      accessToken: 'pk.eyJ1IjoiYW5uYWV0IiwiYSI6ImNpcXdkeTFhdzAwMnBodG5qZnhsa3pwNzgifQ.sLCy6WaD4pURO1ulOFoVCg'
    }).addTo(map);

    angular.element(document).ready(function () {
      map.invalidateSize();
    });
  });
