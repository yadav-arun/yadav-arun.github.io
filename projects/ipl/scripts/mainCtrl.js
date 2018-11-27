
angular
    .module('portfolioApp')
    .controller('mainCtrl', function($scope) {
      $scope.activeClass = "";
      function onTouchStart() { }
      function onTouchMove() { }
      function onMouseWheel() { }
      function onWheel() { }
    document.addEventListener('touchstart', onTouchStart, {passive: true});
    document.addEventListener('touchmove', onTouchMove, {passive: true});
    document.addEventListener('mousewheel', onMouseWheel, {passive: true});
    document.addEventListener('wheel', onWheel, {passive: true});
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js');
      }
      $scope.toggleMenu = function() {
        if ($scope.activeClass == "") {
          $scope.activeClass = "active";
        }else {
          $scope.activeClass = "";
        }
      }
    });
