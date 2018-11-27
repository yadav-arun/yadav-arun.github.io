angular
    .module('portfolioApp')
    .controller('DashboardHomeCtrl', function($scope, $http, $window, DTOptionsBuilder, DTColumnDefBuilder) {

        $scope.data = {};
        $scope.option = {};
        $scope.data.selectedYear = "ALL";

        var data = {};


        $scope.option.dtOptions = DTOptionsBuilder.newOptions()
            .withBootstrap()
            .withDOM('Rftip')
            .withOption('aaSorting', [0, 'desc'])
            .withOption('sDom', '<"top"f>rt<"bottom"p><"clear"i>')
            .withOption('responsive', true)
            .withOption('pagingType', 'full_numbers')
            .withDisplayLength(10);


        $scope.option.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4),
            DTColumnDefBuilder.newColumnDef(5),
        ];

        $scope.option.dtColumnDefsNoBalls = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
        ];


        $scope.option.dtOptionsNoBalls = DTOptionsBuilder.newOptions()
            .withBootstrap()
            .withDOM('Rlftip')
            .withOption('aaSorting', [0, 'desc'])
            .withOption('sDom', '<"top"f>rt<"bottom"p><"clear"i>')
            .withOption('responsive', true)
            .withOption('pagingType', 'full_numbers')
            .withDisplayLength(10);

        data.selectedTeamToss = "ALL";
        data.totalRuns = 0;
        data.runsYearWise = {};
        data.runsYearWise["ALL"] = 0;
        data.ballsYearWise = {};
        data.ballsYearWise["ALL"] = 0;

        data.bowlerThatPlayedAllSeasons = {};

        data.noBallsData = {};
        data.individualPlayerRunData = {};
        data.individualPlayerBallsPlayedData = {};

        data.maximumFours = {};
        data.maximumSixes = {};
        data.maximumFours["ALL"] = {};
        data.maximumSixes["ALL"] = {};
        data.wicketsYearWise = {};
        data.wicketsYearWise["ALL"] = 0;
        var temp1 = [];
        data.noBallsData["ALL"] = {};
        data.individualPlayerRunData["ALL"] = {};
        data.individualPlayerBallsPlayedData["ALL"] = {};




        $scope.changeInYear = function() {
            initializeDataMatches($scope.data.selectedYear , $scope.data);
            generateDataChart($scope.data.selectedYear);
        }



        function fetchDeliveriesData() {
        Papa.parse("../data/deliveries.csv", {
            download: true,
            worker: true,
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: function(results) {
                // $window.localStorage.DeliveriesData = JSON.stringify(results);
                    data.ballsYearWise["ALL"] += results.data.length;

                    var myWorker = new Worker("calculation.js");

                    myWorker.onmessage = function (oEvent) {
                      data = oEvent.data;
                        // alert("Answer: " + oEvent.data);
                                        generateOnetimeDataChart("ALL")

                                        initializeDataMatches("ALL" , data);
                                        $scope.data = data;
                                        $scope.data.yearListVisible = [];
                                        $scope.data.yearListVisible = ["ALL"].concat(angular.copy(data.yearList));
                                        $scope.data.selectedYear = "ALL";
                                        $scope.$apply();
                    };
                    var sendDatatoWorker = [results,data];
                    myWorker.postMessage(sendDatatoWorker); // start the worker.




                // angular.forEach(data.bowlerThatPlayedAllSeasons, function(key, value) {
                //     if (key.length == data.yearList.length) {
                //     }
                // })
            }
        });
      }

        function initializeDataMatches(year , data) {
            var individualMaximumFour = Object.keys(data.maximumFours[year]).reduce(function(a, b) {
                return data.maximumFours[year][a] > data.maximumFours[year][b] ? a : b
            });
            data.maximumFoursPlayer = individualMaximumFour + " - " + data.maximumFours[year][individualMaximumFour]

            var individualMaximumSix = Object.keys(data.maximumSixes[year]).reduce(function(a, b) {
                return data.maximumSixes[year][a] > data.maximumSixes[year][b] ? a : b
            });
            data.maximumSixesPlayer = individualMaximumSix + " - " + data.maximumSixes[year][individualMaximumSix]
        }

        function foo(arr) {
            var a = [],
                b = [],
                prev;

            arr.sort();
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] !== prev) {
                    a.push(arr[i]);
                    b.push(1);
                } else {
                    b[b.length - 1]++;
                }
                prev = arr[i];
            }

            return [a, b];
        }


        data.city = [];
        data.team = [];
        data.resultList = [];
        data.yearList = [];
        data.yearWiseData = {};
        data.yearWiseUmpires = {};
        data.yearWiseWinner = {};
        data.yearWiseVenues = {};
        data.yearWiseCities = {};
        data.yearWiseMatchesPlayed = {};
        data.yearWiseFinalWinner = {};
        data.player_of_matchyearWiseDetails = {};
        data.yearWisetossWinnerIsWinner = {};
        data.yearWisetossWinnerIsLoser = {};
        data.bigMarginWinMatches = {};

        data.matchesData = [];
        data.player_of_matchyearWiseDetails["ALL"] = {};
        data.yearWisetossWinnerIsWinner["ALL"] = {};
        data.yearWisetossWinnerIsLoser["ALL"] = {};
        data.yearWiseWinner["ALL"] = {};
        data.yearWiseVenues["ALL"] = {};
        data.yearWiseCities["ALL"] = {};
        data.yearWiseUmpires["ALL"] = {};
        data.bigMarginWinMatches["ALL"] = [];
        data.maximumFours["ALL"] = {};
        data.maximumSixes["ALL"] = {};

        function inArray(myArray,myValue){
            var inArray = false;
            myArray.map(function(key){
                if (key === myValue){
                    inArray=true;
                }
            });
            return inArray;
        };

        Papa.parse("data/matches.csv", {
            download: true,
            // worker: true,
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: function(results) {
                data.matchesData = results.data;
                for (var i = 0; i < results.data.length; i++) {
                    data.resultList.push(results.data[i].result)
                    if (!inArray(data.city, results.data[i].city) && results.data[i].city) {
                        data.city.push(results.data[i].city)
                    }

                    if (!inArray(data.team, results.data[i].team1) && results.data[i].team1) {
                        data.team.push(results.data[i].team1)
                    }


                    if (!inArray(data.yearList, results.data[i].season) && results.data[i].season) {
                        data.yearList.push(results.data[i].season)
                        data.yearWiseData[results.data[i].season] = [];
                        data.player_of_matchyearWiseDetails[results.data[i].season] = {};
                        data.yearWisetossWinnerIsWinner[results.data[i].season] = {};
                        data.yearWisetossWinnerIsLoser[results.data[i].season] = {};
                        data.yearWiseWinner[results.data[i].season] = {};
                        data.yearWiseVenues[results.data[i].season] = {};
                        data.yearWiseCities[results.data[i].season] = {};
                        data.yearWiseUmpires[results.data[i].season] = {};
                        data.bigMarginWinMatches[results.data[i].season] = [];


                        data.runsYearWise[results.data[i].season] = 0;
                        data.ballsYearWise[results.data[i].season] = 0;
                        data.noBallsData[results.data[i].season] = {};
                        data.individualPlayerRunData[results.data[i].season] = {};
                        data.individualPlayerBallsPlayedData[results.data[i].season] = {};
                        data.maximumFours[results.data[i].season] = {};
                        data.maximumSixes[results.data[i].season] = {};
                    }
                    $scope.data.yearListVisible = [];
                    $scope.data.yearListVisible = ["ALL"].concat(angular.copy(data.yearList));

                    data.yearWiseData[results.data[i].season].push(results.data[i])


                    if (results.data[i].winner && results.data[i].toss_winner == results.data[i].winner) {
                        if (data.yearWisetossWinnerIsWinner[results.data[i].season][results.data[i].toss_winner] == undefined) {
                            data.yearWisetossWinnerIsWinner[results.data[i].season][results.data[i].toss_winner] = 0;
                        }
                        if (data.yearWisetossWinnerIsWinner["ALL"][results.data[i].toss_winner] == undefined) {
                            data.yearWisetossWinnerIsWinner["ALL"][results.data[i].toss_winner] = 0;
                        }
                        data.yearWisetossWinnerIsWinner[results.data[i].season][results.data[i].toss_winner] += 1
                        data.yearWisetossWinnerIsWinner["ALL"][results.data[i].toss_winner] += 1
                    }else {
                      if (data.yearWisetossWinnerIsLoser[results.data[i].season][results.data[i].toss_winner] == undefined) {
                          data.yearWisetossWinnerIsLoser[results.data[i].season][results.data[i].toss_winner] = 0;
                      }
                      if (data.yearWisetossWinnerIsLoser["ALL"][results.data[i].toss_winner] == undefined) {
                          data.yearWisetossWinnerIsLoser["ALL"][results.data[i].toss_winner] = 0;
                      }
                      data.yearWisetossWinnerIsLoser[results.data[i].season][results.data[i].toss_winner] += 1
                      data.yearWisetossWinnerIsLoser["ALL"][results.data[i].toss_winner] += 1
                    }


                    if (data.yearWiseUmpires[results.data[i].season][results.data[i].umpire1] == undefined) {
                        data.yearWiseUmpires[results.data[i].season][results.data[i].umpire1] = 0;
                    }
                    if (data.yearWiseUmpires["ALL"][results.data[i].umpire1] == undefined) {
                        data.yearWiseUmpires["ALL"][results.data[i].umpire1] = 0;
                    }
                    if (data.yearWiseUmpires["ALL"][results.data[i].umpire2] == undefined) {
                        data.yearWiseUmpires["ALL"][results.data[i].umpire2] = 0;
                    }
                    data.yearWiseUmpires[results.data[i].season][results.data[i].umpire1] += 1;
                    data.yearWiseUmpires["ALL"][results.data[i].umpire1] += 1;
                    if (data.yearWiseUmpires[results.data[i].season][results.data[i].umpire2] == undefined) {
                        data.yearWiseUmpires[results.data[i].season][results.data[i].umpire2] = 0;
                    }
                    data.yearWiseUmpires[results.data[i].season][results.data[i].umpire2] += 1;
                    data.yearWiseUmpires["ALL"][results.data[i].umpire2] += 1;


                    if (data.yearWiseWinner[results.data[i].season][results.data[i].winner] == undefined) {
                        data.yearWiseWinner[results.data[i].season][results.data[i].winner] = 0;
                    }
                    if (data.yearWiseWinner["ALL"][results.data[i].winner] == undefined) {
                        data.yearWiseWinner["ALL"][results.data[i].winner] = 0;
                    }
                    data.yearWiseWinner[results.data[i].season][results.data[i].winner] += 1;
                    data.yearWiseWinner["ALL"][results.data[i].winner] += 1;

                    if (data.yearWiseVenues[results.data[i].season][results.data[i].venue] == undefined) {
                        data.yearWiseVenues[results.data[i].season][results.data[i].venue] = 0;
                    }
                    if (data.yearWiseVenues["ALL"][results.data[i].venue] == undefined) {
                        data.yearWiseVenues["ALL"][results.data[i].venue] = 0;
                    }
                    data.yearWiseVenues[results.data[i].season][results.data[i].venue] += 1;
                    data.yearWiseVenues["ALL"][results.data[i].venue] += 1;

                    if (data.yearWiseCities[results.data[i].season][results.data[i].city] == undefined) {
                        data.yearWiseCities[results.data[i].season][results.data[i].city] = 0;
                    }
                    if (data.yearWiseCities["ALL"][results.data[i].city] == undefined) {
                        data.yearWiseCities["ALL"][results.data[i].city] = 0;
                    }
                    data.yearWiseCities[results.data[i].season][results.data[i].city] += 1;
                    data.yearWiseCities["ALL"][results.data[i].city] += 1;

                    if (data.player_of_matchyearWiseDetails[results.data[i].season][results.data[i].player_of_match] == undefined) {
                        data.player_of_matchyearWiseDetails[results.data[i].season][results.data[i].player_of_match] = 0;
                    }
                    if (data.player_of_matchyearWiseDetails["ALL"][results.data[i].player_of_match] == undefined) {
                        data.player_of_matchyearWiseDetails["ALL"][results.data[i].player_of_match] = 0;
                    }
                    data.player_of_matchyearWiseDetails[results.data[i].season][results.data[i].player_of_match] += 1;
                    data.player_of_matchyearWiseDetails["ALL"][results.data[i].player_of_match] += 1;


                    if (results.data[i].win_by_runs >= 100 || results.data[i].win_by_wickets >= 10) {
                        data.bigMarginWinMatches[results.data[i].season].push(results.data[i])
                        data.bigMarginWinMatches["ALL"].push(results.data[i])
                    }

                }
                fetchDeliveriesData();
                generateDataChart("ALL")
                $scope.data = data;
                $scope.$apply();

                for (var i = 0; i < data.yearList.length; i++) {
                    data.yearWiseFinalWinner[data.yearList[i]] = data.yearWiseData[data.yearList[i]][data.yearWiseData[data.yearList[i]].length - 1].winner;
                }

                $scope.data.yearListVisible = [];
                $scope.data.yearListVisible = ["ALL"].concat(angular.copy(data.yearList));


                // for (var i = 0; i < data.yearList.length; i++) {
                //   data.yearWiseData[data.yearList[i]]
                // }
            }
        });


        var generateDataChart = function(year) {

            data.batsmenWiseScoreToArray = []
            angular.forEach(data.individualPlayerRunData[year], function(key, value) {
            data.totalPlayers += 1;
                if (value) {
                    data.batsmenWiseScoreToArray.push({
                        value: value,
                        key: key
                    });
                }
            });

            data.totalCities = 0;
            data.citiesChartData = []
            angular.forEach(data.yearWiseCities[year], function(key, value) {
            data.totalCities += 1;
                if (value) {
                    data.citiesChartData.push({
                        value: value,
                        key: key
                    });
                }
            });

            data.matchWinnerChartData = []
            data.displayMatchWonUniqueData = false;
            angular.forEach(data.yearWiseWinner[year], function(key, value) {
                if (value) {
                    data.matchWinnerChartData.push({
                        value: value,
                        key: key
                    });
                }

                if (year != "ALL") {

                    if (data.yearWiseWinner[year][value] > data.yearWiseWinner[year][data.yearWiseFinalWinner[year]]) {
                        data.displayMatchWonUniqueData = true;
                        data.displayMatchWonUniqueString = "Despite " + value + " winning " + key + " matches in year " + year + ", more than " + data.yearWiseFinalWinner[year] + " winning total of " + data.yearWiseWinner[year][data.yearWiseFinalWinner[year]] + " matches, " + data.yearWiseFinalWinner[year] + " became winner that year";
                    }
                }
            });

            data.totalVenues = 0;
            data.venuesChartData = []
            angular.forEach(data.yearWiseVenues[year], function(key, value) {
            data.totalVenues += 1;
                if (value) {
                    data.venuesChartData.push({
                        value: value,
                        key: key
                    });
                }
            });

            data.TossDecisionChartData = [];
            data.tossWinnerIsWinner = 0
            data.tossWinnerIsLoser = 0
            angular.forEach(data.yearWisetossWinnerIsWinner[year], function(key, value) {
                if (data.selectedTeamToss == "ALL") {
                  data.tossWinnerIsWinner += key
                }else {
                  if (data.selectedTeamToss == value) {
                    data.tossWinnerIsWinner += key
                  }
                }
            });
            angular.forEach(data.yearWisetossWinnerIsLoser[year], function(key, value) {
                if (data.selectedTeamToss == "ALL") {
                  data.tossWinnerIsLoser += key
                }else {
                  if (data.selectedTeamToss == value) {
                    data.tossWinnerIsLoser += key
                  }
                }
            });

            data.TossDecisionChartData.push({label : "Toss Winner is Winner" ,value : data.tossWinnerIsWinner});
            data.TossDecisionChartData.push({label : "Toss Winner is Loser" ,value : data.tossWinnerIsLoser});
            // data.yearWisetossWinnerIsWinner
            // data.yearWisetossWinnerIsLoser
        }

        var alphabets = ["a","b","c"]
        var generateOnetimeDataChart = function() {

        }
    });
