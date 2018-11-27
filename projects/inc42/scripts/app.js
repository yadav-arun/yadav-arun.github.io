angular.module('TableApp', [])
    .controller('mainCtrl', function($scope, $http) {
        $scope.data = {};
        $scope.selected = [];
        $scope.visible = [];
        $scope.leftIndex = 0;

        var itemsVisible = 0;

        // HTTP Request to get JSON Data for companies
        $http({
            url: "companies.json"
        }).then(function(resp) {
            $scope.Users = resp.data.companies;
        }, function(err) {
            console.log(err)
        })

        // Options Created to be visible in the menu, those with selected true, are visible at the start
        $scope.options = [{
            name: "location",
            selected: true
        }, {
            name: "website",
            selected: true
        }, {
            name: "market",
            selected: true
        }, {
            name: "employees",
            selected: true
        }, {
            name: "stage",
            selected: false
        }, {
            name: "founders",
            selected: false
        }];

        // Out of selected, which are to be shown at the start are displayed here
        for (var i = 0; i < $scope.options.length; i++) {
            if ($scope.options[i].selected) {
                $scope.selected.push($scope.options[i].name);
                if (itemsVisible <= 4) {
                    $scope.visible.push($scope.options[i].name);
                }
            }
        }

        // This Method executes when an option is selected or deselected
        $scope.changeInSelected = function(index, isSelected, name) {
            if (isSelected) {
                $scope.selected.push($scope.options[index].name);
            } else {
                var indexInSelected = $scope.selected.indexOf(name);
                $scope.selected.splice(indexInSelected, 1);
                var indexInVisible = $scope.visible.indexOf(name);
                if ($scope.leftIndex > 0) {
                    $scope.leftIndex--;
                }
                if (indexInVisible > -1) {
                    $scope.visible = $scope.selected.slice($scope.leftIndex, $scope.leftIndex + 4);
                }
            }
        }

        // This Method executes when Right arrow is clicked
        $scope.shiftRight = function() {
            $scope.leftIndex++;
            $scope.visible = $scope.selected.slice($scope.leftIndex, $scope.leftIndex + 4);
        }

        // This Method executes when Left arrow is clicked
        $scope.shiftLeft = function() {
            $scope.leftIndex--;
            $scope.visible = $scope.selected.slice($scope.leftIndex, $scope.leftIndex + 4);
        }

    });
