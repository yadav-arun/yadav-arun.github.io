angular
.module('portfolioApp')

.controller('DashboardHomeCtrl', function($scope, $http, $window, moment, $http) {
  $scope.data = {};

  var seriesOptions = [];
  $scope.loading = false;
  $scope.recentQuotes = [];
  var selectedCodes = [];
  var j = 0;
  if (!$window.localStorage.searched) {
    $window.localStorage.searched = [];
  } else {
    $scope.recentQuotes = JSON.parse($window.localStorage.searched);
  }

  function drawMany() {
    $scope.loading = true;

    seriesOptions = [];
    selectedCodes = [];
    for (var i = 0; i < $scope.recentQuotes.length; i++) {
      if ($scope.recentQuotes[i].checked) {
        selectedCodes.push($scope.recentQuotes[i].name);
      }
    }
    for (var i = 0; i < $scope.recentQuotes.length; i++) {
      if ($scope.recentQuotes[i].checked) {
        drawPreselected($scope.recentQuotes[i].name)
      }
    }
  }
  drawMany();


  function drawPreselected(preset) {
    var selectedCode = preset;
    var url = "https://www.quandl.com/api/v3/datasets/XNSE/" + selectedCode + ".json?api_key=gWf2CLShwrGUBVnqzsT4"
    $http({
      method: 'GET',
      url: url,
    })
    .success(function(data) {

      var latestClose = data.dataset.data[0][4];
      var change = (((data.dataset.data[1][4] - data.dataset.data[0][4]) / (data.dataset.data[0][4])) * 100).toFixed(2);

      var array = [];
      var requiredData = data.dataset.data;
      for (var i = 0; i < requiredData.length; i++) {
        array.push([moment(requiredData[i][0]).unix() * 1000, requiredData[i][4]]);
      }
      array = array.reverse();

      seriesData = {
        name: data.dataset.dataset_code + ' Closing at',
        data: array,
      }
      seriesOptions.push(seriesData);
      if (seriesOptions.length == selectedCodes.length) {
        createChart()
      }
    })
    .error(function() {});
  }


  $scope.changeInSelected = function(which, isSelected , index) {
    $scope.loading = true;
    var j = 0;
    for (var i = 0; i < $scope.recentQuotes.length; i++) {
      if ($scope.recentQuotes[i].checked) {
        j++;
      }
    }
    if (j == 0 && !isSelected) {
      alert("Atleast One should be selected");
      $scope.recentQuotes[index].checked = true;
    }

    if (j == 4 && isSelected) {
      $scope.maxReached = true;
    } else {
      $scope.maxReached = false;
    }

    for (var i = 0; i < $scope.recentQuotes.length; i++) {
      if (which == $scope.recentQuotes[i].name) {
        $scope.recentQuotes[i].checked = isSelected;
      }
    }
    $window.localStorage.searched = JSON.stringify($scope.recentQuotes);
    drawMany();

  }

  $scope.deleteItem = function(index) {
    $scope.recentQuotes.splice(index, 1);
    $window.localStorage.searched = JSON.stringify($scope.recentQuotes);
  }
  $scope.selectOne = function(index) {
    $scope.loading = true;

    for (var i = 0; i < $scope.recentQuotes.length; i++) {
      $scope.recentQuotes[i].checked = false;
    }
    $scope.recentQuotes[index].checked = true;
    $window.localStorage.searched = JSON.stringify($scope.recentQuotes);
    $scope.changeInConfig($scope.recentQuotes[index].name);
  }


  Papa.parse("data/codes.csv", {
    download: true,
    header: false,
    dynamicTyping: true,
    skipEmptyLines: true,
    complete: function(results) {
      $scope.data.codesList = results.data;
    }
  });


  function createChart() {
    Highcharts.stockChart('container', {
      rangeSelector: {
        selected: 1,
      },

      title: {
        text: "Stock Chart"
      },

      series: seriesOptions
    });
    $scope.loading = false;
  }


  $scope.changeInConfig = function(preset) {
    $scope.loading = true;
    $scope.maxReached = false;
    var selectedCode;
    if (!preset) {
      var selectedCode = angular.copy($scope.data.selectedType).replace('XNSE/', '');
    } else {
      var selectedCode = preset;
    }

    var url = "https://www.quandl.com/api/v3/datasets/XNSE/" + selectedCode + ".json?api_key=gWf2CLShwrGUBVnqzsT4"
    $http({
      method: 'GET',
      url: url,
    })
    .success(function(data) {
      var latestClose = data.dataset.data[0][4];
      var change = (((data.dataset.data[1][4] - data.dataset.data[0][4]) / (data.dataset.data[0][4])) * 100).toFixed(2);
      var array = [];
      var requiredData = data.dataset.data;
      for (var i = 0; i < requiredData.length; i++) {
        array.push([moment(requiredData[i][0]).unix() * 1000, requiredData[i][4]]);
      }

      array = array.reverse();

      seriesOptions = [{
        name: data.dataset.dataset_code + ' Closing at',
        data: array,
      }]
      // Create the chart
      createChart(data);

      if (!$window.localStorage.searched) {
        $window.localStorage.searched = [];
      } else {
        $scope.recentQuotes = JSON.parse($window.localStorage.searched);
      }

      var dataToLocalStorage = {
        name: selectedCode,
        latestClose: latestClose,
        change: change,
        checked: true
      };
      var alreadyPresent = false;
      if ($scope.recentQuotes.length != 0) {
        for (var i = 0; i < $scope.recentQuotes.length; i++) {
          $scope.recentQuotes[i].checked = false;
          if ($scope.recentQuotes[i].name == selectedCode) {
            $scope.recentQuotes[i].checked = true;
            alreadyPresent = true;
          }
        }
        if (!alreadyPresent) {
          $scope.recentQuotes.push(dataToLocalStorage);
        }
      } else {
        $scope.recentQuotes.push(dataToLocalStorage)
      }
      $window.localStorage.searched = JSON.stringify($scope.recentQuotes);
    })
    .error(function() {});
  }


});
