var app = angular.module('musicPlayer', []);

app.config(function($routeProvider) {
 $routeProvider
     .when('/', {
      controller: 'HomeController',
      templateUrl: 'client/home.html'
     })
 		.when('/photos', {
   		controller: 'PhotoController',
      templateUrl: 'client/photo.html'
 		})
      .otherwise({
        redirectTo: '/'
      });
}); 
