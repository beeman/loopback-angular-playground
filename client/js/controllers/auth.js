app = angular.module('app');

app.controller('AuthLoginController', ['$scope', 'AuthService', '$state', function($scope, AuthService, $state) {

  $scope.user = {
    email: 'foo@bar.com',
    password: 'foobar'
  };

  $scope.login = function() {
    AuthService.login($scope.user.email, $scope.user.password).then(function() {
      $state.go('home');
    });
  };

}]);

app.controller('AuthLogoutController', ['$scope', 'AuthService', '$state', function($scope, AuthService, $state) {

  AuthService.logout().then(function() {
    $state.go('home');
  });

}]);

app.controller('SignUpController', ['$scope', 'AuthService', '$state', function($scope, AuthService, $state) {

  $scope.user = {
    email: 'baz@qux.com',
    password: 'bazqux'
  };

  $scope.register = function() {
    AuthService.register($scope.user.email, $scope.user.password).then(function() {
      $state.transitionTo('sign-up-success');
    });
  };

}]);
