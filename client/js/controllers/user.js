app = angular.module('app');

app.controller('UsersController', ['$scope', 'User', function ($scope) {
  $scope.submenus = [
    {
      name: 'All users',
      sref: 'users.list',
      public: true
    }, {
      name: 'Add user',
      sref: 'users.add'
    }
  ];
}]);


app.controller('AllUsersController', ['$scope', 'User', function ($scope, User) {
  $scope.loading = true;
  $scope.users = User.find(
    {
      filter: {
        include: ['roles']
      }
    }
    , function () {
      $scope.loading = false;
    });
}]);

app.controller('AddUserController', ['$scope', 'CoffeeShop', 'User',
  '$state', function ($scope, CoffeeShop, User, $state) {
    $scope.action = 'Add';
    $scope.coffeeShops = [];
    $scope.selectedShop;
    $scope.user = {};
    $scope.isDisabled = false;

    CoffeeShop
      .find()
      .$promise
      .then(function (coffeeShops) {
        $scope.coffeeShops = coffeeShops;
        $scope.selectedShop = $scope.selectedShop || coffeeShops[0];
      });

    $scope.submitForm = function () {
      User
        .create({
          email: $scope.user.email,
          username: $scope.user.username,
          password: $scope.user.password,
          roles: [
            {
              name: 'users'
            }
          ]
        })
        .$promise
        .then(function () {
          $state.go('users.list');
        });
    };
  }]);
app.controller('DeleteUserController', ['$scope', 'User', '$state',
  '$stateParams', function ($scope, User, $state, $stateParams) {
    User
      .deleteById({id: $stateParams.id})
      .$promise
      .then(function () {
        $state.go('users.mine');
      });
  }]);
app.controller('EditUserController', ['$scope', '$q', 'CoffeeShop', 'User',
  '$stateParams', '$state', function ($scope, $q, CoffeeShop, User,
                                      $stateParams, $state) {
    $scope.action = 'Edit';
    $scope.user = {};
    $scope.isDisabled = true;

    $q
      .all([
        User.findById({id: $stateParams.id}).$promise
      ])
      .then(function (data) {
        $scope.user = data[0];
      });

    $scope.submitForm = function () {
      $scope.user
        .$save()
        .then(function (user) {
          console.log(user);
        })
        .then(function (user) {
          $state.go('users.list');
        });
    };
  }]);
app.controller('ViewUserController', ['$scope', '$q', 'Note', 'Review', 'User',
  '$stateParams', '$state', function ($scope, $q, Note, Review, User,
                                      $stateParams, $state) {
    $scope.action = 'Edit';
    $scope.user = {};
    $scope.isDisabled = true;

    $q
      .all([
        User.findOne({
          filter: {
            where: {
              id: $stateParams.id
            },
            include: [
              'roles',
              'notes',
              'reviews'
            ]
          }
        }).$promise
      ])
      .then(function (data) {
        $scope.user = data[0];
      });

    $scope.submitForm = function () {
      $scope.user
        .$save()
        .then(function (user) {
          $state.go('users.list');
        });
    };
  }]);
