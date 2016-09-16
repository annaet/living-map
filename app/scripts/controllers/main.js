'use strict';

/**
 * @ngdoc function
 * @name livingMapApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the livingMapApp
 */
angular.module('livingMapApp')
  .controller('MainCtrl', function ($scope, $window, $http) {
    var L = $window.L;
    var appId = '4a7cfc43';
    var appKey = 'e022d68d06f5c680913930d5422ee458';

    var map = L.map('lm-map').setView([51.5145264,-0.153735], 11);
    L.esri.basemapLayer('DarkGray').addTo(map);

    angular.element(document).ready(function () {
      map.invalidateSize();
    });

    var stationMarkers = [];
    var stationsById = {};
    var stationsByName = {};
    var stations = [];
    var orderedLineRoutes = [];

    var centralLineStops = 'https://api.tfl.gov.uk/Line/central/Route/Sequence/inbound?excludeCrowding=True&app_id=' + appId + '&app_key=' + appKey;

    // get the station coordinates to draw lines
    $http.get(centralLineStops).then(function(response) {
      var data = response.data;
      console.log(response);
      orderedLineRoutes = data.orderedLineRoutes;

      // routes
      for (var i = 0; i < data.lineStrings.length; ++i) {
        var string = data.lineStrings[i];
        var line = JSON.parse(string)[0];
        var flippedLine = flipLatLngs(line);
        L.polyline(flippedLine, {color: 'red'}).addTo(map);
      }

      // stations
      stations = data.stations;
      console.log(stations);
      for (var i = 0; i < stations.length; ++i) {
        var station = stations[i];
        stationsById[station.id] = station;

        var sliceIndex = station.name.indexOf(' Underground Station');
        var shortName = station.name.slice(0, sliceIndex);
        stationsByName[shortName] = station;

        var latlng = new L.LatLng(station.lat, station.lon);
        stationMarkers = L.marker(latlng).addTo(map);
      }
      console.log(stationsById);

      // trains
      for (var i = 0; i < orderedLineRoutes.length && i < 1; ++i) {
        var naptanIds = orderedLineRoutes[i].naptanIds;

        for (var j = 1; j < naptanIds.length; ++j) {
          var lastId = naptanIds[j - 1];
          var thisId = naptanIds[j];

          getTrains(lastId, thisId);
          // TODO: get trains at stations
          //       not just trains between stations
          // There's probably a better way of doing this...
        }
      }
    });

    var getTrains = function(destination, arrival) {
      var arrivalUrl = 'https://api.tfl.gov.uk/Line/central/Arrivals/' + destination + '?direction=inbound&destinationStationId=' + arrival + '&app_id=' + appId + '&app_key=' + appKey;

      $http.get(arrivalUrl).then(function(response) {
        var data = response.data;
        console.log(data);

        for (var k = 0; k < data.length; ++k) {
          if (stationsById[destination] && stationsById[arrival]) {
            // get middle of two stations
            var x1 = stationsById[destination].lat;
            var y1 = stationsById[destination].lon;
            var x2 = stationsById[arrival].lat;
            var y2 = stationsById[arrival].lon;

            var trainLat = (x1 + x2) / 2;
            var trainLon = (y1 + y2) / 2;

            // plot train
            // TODO: Change the icon!
            L.marker([trainLat, trainLon]).setOpacity(0.5).addTo(map);
            console.log('added marker!!');
          }
        }
      });
    };

    // For some reason the API returns [lng, lat] coordinates
    // so need to swap them round
    var flipLatLngs = function(lngLatList) {
      var latLngList = [];

      for (var i = 0; i < lngLatList.length; ++i) {
        var lngLat = lngLatList[i];
        latLngList.push([lngLat[1], lngLat[0]]);
      }

      return latLngList;
    };

      // This doesn't seem to work
      // Trying to get all arrivals for the central line
      // Sort by train id
      // Then determine which station the train is between
      // But results in most trains being between the same stations
      // ????????

      // var centralLineArrivals = 'https://api.tfl.gov.uk/Line/central/Arrivals?direction=outbound&app_id=' + appId + '&app_key=' + appKey;

      // $http.get(centralLineArrivals).then(function(response) {
      //   var arrivals = response.data;
      //   console.log(arrivals);

      //   var trains = {};
      //   var nearestTrains = [];

      //   for (var j = 0; j < arrivals.length; ++j) {
      //     var arrival = arrivals[j];
      //     if (!trains[arrival.vehicleId]) {
      //       trains[arrival.vehicleId] = [];
      //     }
      //     trains[arrival.vehicleId].push(arrival);
      //   }
      //   console.log(trains);

      //   for (var train in trains) {
      //     var trainArrivals = trains[train];
      //     var nextArrival;

      //     for (var j = 0; j < trainArrivals.length; ++j) {
      //       var thisArrival = trainArrivals[j];
      //       if (!nextArrival || thisArrival.timeToStation < nextArrival.timeToStation) {
      //         nextArrival = thisArrival;
      //       }
      //     }

      //     for (var j = 0; j < orderedLineRoutes.length; ++j) {
      //       var naptanIds = orderedLineRoutes[j].naptanIds;

      //       for (var k = 0; k < naptanIds.length; ++k) {
      //         var naptanId = naptanIds[k];
      //         if (naptanId === nextArrival.naptanId) {
      //           if (k === 0) {
      //             nextArrival.previousStation = naptanId;
      //           } else {
      //             nextArrival.previousStation = naptanIds[k - 1];
      //           }
      //         }
      //       }
      //     }

      //     if (nextArrival) {
      //       nearestTrains.push(nextArrival);
      //     }
      //   }
      //   console.log(nearestTrains);

      //   for (var j = 0; j < nearestTrains.length; ++j) {
      //     var train = nearestTrains[j];
      //     var location = train.currentLocation;

      //     if (location.indexOf('Between') === 0) {
      //       var start = location.slice(7, location.indexOf(' and '));
      //       var end = location.slice(location.indexOf(' and ') + 4, location.length);
      //       console.log(start);
      //       console.log(end);

      //       // var train
      //     } else if (train.currentLocation.indexOf('At') === 0) {

      //     }
      //     // console.log(stationsById[train.naptanId].lat);
      //   }
      // });

  });
