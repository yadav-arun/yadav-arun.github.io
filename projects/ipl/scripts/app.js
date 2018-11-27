angular.module('portfolioApp', [
        'ui.router',
        'datatables',
        'datatables.bootstrap',
        'angular.morris'
    ])
    .run(['$rootScope', '$state', '$stateParams', function($rootScope, $state) {
        $rootScope.$state = $state;


        var consoleHolder = console;
        function debug(bool){
            if(!bool){
                consoleHolder = console;
                console = {};
                console.log = function(){};
            }else
                console = consoleHolder;
        }
        debug(true);
    }])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider
            .when('', '/dashboard/home');

        $stateProvider
            .state('dashboard', {
                abstract: true,
                url: '/dashboard',
                templateUrl: 'views/app.html',
            })
        //
        //dashboard
        //
        .state('dashboard.home', {
                url: '/home',
                controller: 'DashboardHomeCtrl',
                templateUrl: 'views/home.html',
            })

        $urlRouterProvider.otherwise('/dashboard/home');
    }]);
    // .constant('CONFIG', {
    // });
