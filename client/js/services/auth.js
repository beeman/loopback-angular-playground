angular
  .module('app')
  .factory('AuthService', ['User', '$q', '$rootScope', function (User, $q,
                                                                 $rootScope) {
    function login(email, password) {
      return User
        .login({email: email, password: password})
        .$promise
        .then(function (response) {
          User.findOne({
            filter: {
              where: {
                id: response.user.id
              },
              include: [
                'roles'
              ]
            }
          }, function (data) {
            console.log('data', data);
            $rootScope.currentUser = data;
          });
        });
    }

    function logout() {
      return User
        .logout()
        .$promise
        .then(function () {
          $rootScope.currentUser = null;
        });
    }

    function register(email, password) {
      return User
        .create({
          email: email,
          password: password
        })
        .$promise;
    }

    return {
      login: login,
      logout: logout,
      register: register
    };
  }]);
