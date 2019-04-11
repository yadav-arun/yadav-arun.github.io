angular.module('formsApp', [])
    .controller('mainCtrl', function($scope, $timeout) {
        $scope.data = {};
        $scope.loading = false;
        $scope.IndextoUpdate = undefined;
        var edit = false;
        $scope.Users = [];
        $scope.add = function() {
          if (edit) {
            $scope.Users[$scope.IndextoUpdate] = $scope.data;
            $scope.IndextoUpdate = undefined;
            edit = false;
            $scope.data = {};
          }else {
            var UserId = new Date().getTime();
            $scope.loading = true;
            $timeout(function () {
            if (!$scope.data.name) {
              $scope.data.name = "--NA--"
            }
            $scope.data.userId = UserId;
            $scope.Users.push($scope.data);
            $scope.loading = false;
            $scope.data = {};
            }, 1500);
          }
        }



        var StringSecure = ["Weak", "Average", "Good", "Very Good", "Excellent"]
        var strength = 0;
        $scope.checkPasswordStrength = function() {
          if ($scope.data.password) {
            var pass = $scope.data.password;
            if (pass.length < 6) {
              strength = 0;
            }else {
              strength = 1;
              if ((/[a-z]/g).test(pass)) {
                strength += 1
              }
              if ((/[A-Z]/g).test(pass)) {
                strength += 2
              }
              if ((/[0-9]/g).test(pass)) {
                strength += 4
              }
              if ((/(.*[!,@,#,$,%,^,&,*,?,_,~])/).test(pass)) {
                strength += 8
              }
            }
          }else {
            strength = 0;
          }

          if (strength == 0) {
            $scope.strengthText =  StringSecure[0];
            $scope.strengthClass = "progress-bar-danger"
            $scope.strengthLength = 20;
          }else if (strength < 3) {
            $scope.strengthClass = "progress-bar-default"
            $scope.strengthText =  StringSecure[1];
            $scope.strengthLength = 40;
          }else if (strength < 7) {
            $scope.strengthClass = "progress-bar-warning"
            $scope.strengthText =  StringSecure[2];
            $scope.strengthLength = 60;
          }else if (strength < 15) {
            $scope.strengthText =  StringSecure[3];
            $scope.strengthClass = "progress-bar-info"
            $scope.strengthLength = 80;
          }else {
            $scope.strengthText =  StringSecure[4];
            $scope.strengthClass = "progress-bar-success"
            $scope.strengthLength = 100;
          }
        }

    $scope.delete = function(index) {
      $scope.Users.splice(index,1)
    }

    $scope.edit = function(index) {
      edit = true;
      $scope.IndextoUpdate = index;
      var array = angular.copy($scope.Users)
      $scope.data = array[index];
      // $scope.Users.splice(index,1)
    }





    })
