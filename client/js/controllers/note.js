var app = angular.module('app');

app.controller('AllNotesController', ['$scope', 'Note', function($scope, Note) {
    $scope.notes = Note.find({
      filter: {
        include: [
        'owner'
        ]
      }
    });
  }]);

app.controller('AddNoteController', ['$scope', 'Note',
  '$state', function($scope, Note, $state) {
    $scope.action = 'Add';
    $scope.note = {};
    $scope.isDisabled = false;

    $scope.submitForm = function() {
      Note.create({
        title: $scope.note.title,
        body: $scope.note.body
      })
      .$promise
      .then(function() {
        $state.go('all-notes');
      });
    };
  }]);

app.controller('DeleteNoteController', ['$scope', 'Note', '$state',
  '$stateParams', function($scope, Note, $state, $stateParams) {
    Note
    .deleteById({ id: $stateParams.id })
    .$promise
    .then(function() {
      $state.go('my-notes');
    });
  }]);

app.controller('EditNoteController', ['$scope', '$q', 'CoffeeShop', 'Note',
  '$stateParams', '$state', function($scope, $q, CoffeeShop, Note,
    $stateParams, $state) {
      $scope.action = 'Edit';
      $scope.note = {};
      $scope.isDisabled = true;

      $q.all([
        CoffeeShop.find().$promise,
          Note.findById({ id: $stateParams.id }).$promise
        ])
        .then(function(data) {
          $scope.note = data[1];
        });

        $scope.submitForm = function() {
          $scope.note
          .$save()
          .then(function(note) {
            $state.go('all-notes');
          });
        };
}]);

app.controller('MyNotesController', ['$scope', 'Note', '$rootScope',
  function($scope, Note, $rootScope) {
    $scope.notes = Note.find({
      filter: {
        where: {
          ownerId: $rootScope.currentUser.id
        },
        include: [
          'owner'
          ]
      }
    });
}]);
