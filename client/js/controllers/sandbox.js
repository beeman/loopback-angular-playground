app = angular.module('app');

app.controller('SandboxController', ['$scope', 'Models', 'Note', function ($scope, Models, Note) {
  $scope.submenus = [
    {
      name: 'Sandbox',
      sref: 'sandbox.index',
      public: true
    }
  ];

  //console.log();

  $scope.result = Models.getModels();

}]);


app.controller('AllReviewsController', ['$scope', 'Review', function ($scope, Review) {
  $scope.reviews = Review.find({
    filter: {
      include: [
        'coffeeShop',
        'reviewer'
      ]
    }
  });
}]);
app.controller('AddReviewController', ['$scope', 'CoffeeShop', 'Review',
  '$state', function ($scope, CoffeeShop, Review, $state) {
    $scope.action = 'Add';
    $scope.coffeeShops = [];
    $scope.selectedShop;
    $scope.review = {};
    $scope.isDisabled = false;

    CoffeeShop
      .find()
      .$promise
      .then(function (coffeeShops) {
        $scope.coffeeShops = coffeeShops;
        $scope.selectedShop = $scope.selectedShop || coffeeShops[0];
      });

    $scope.submitForm = function () {
      Review
        .create({
          rating: $scope.review.rating,
          comments: $scope.review.comments,
          coffeeShopId: $scope.selectedShop.id
        })
        .$promise
        .then(function () {
          $state.go('reviews.list');
        });
    };
  }]);
app.controller('DeleteReviewController', ['$scope', 'Review', '$state',
  '$stateParams', function ($scope, Review, $state, $stateParams) {
    Review
      .deleteById({id: $stateParams.id})
      .$promise
      .then(function () {
        $state.go('reviews.mine');
      });
  }]);
app.controller('EditReviewController', ['$scope', '$q', 'CoffeeShop', 'Review',
  '$stateParams', '$state', function ($scope, $q, CoffeeShop, Review,
                                      $stateParams, $state) {
    $scope.action = 'Edit';
    $scope.coffeeShops = [];
    $scope.selectedShop;
    $scope.review = {};
    $scope.isDisabled = true;

    $q
      .all([
        CoffeeShop.find().$promise,
        Review.findById({id: $stateParams.id}).$promise
      ])
      .then(function (data) {
        var coffeeShops = $scope.coffeeShops = data[0];
        $scope.review = data[1];
        $scope.selectedShop;

        var selectedShopIndex = coffeeShops
          .map(function (coffeeShop) {
            return coffeeShop.id;
          })
          .indexOf($scope.review.coffeeShopId);
        $scope.selectedShop = coffeeShops[selectedShopIndex];
      });

    $scope.submitForm = function () {
      $scope.review.coffeeShopId = $scope.selectedShop.id;
      $scope.review
        .$save()
        .then(function (review) {
          $state.go('reviews.list');
        });
    };
  }]);
app.controller('MyReviewsController', ['$scope', 'Review', '$rootScope',
  function ($scope, Review, $rootScope) {
    $scope.reviews = Review.find({
      filter: {
        where: {
          publisherId: $rootScope.currentUser.id
        },
        include: [
          'coffeeShop',
          'reviewer'
        ]
      }
    });
  }]);
