var app = angular.module('app');

app.controller('NotesController', ['$scope', 'Review', function ($scope, Review) {
  $scope.submenus = [
    {
      name: 'All notes',
      sref: 'notes.list',
      public: true
    }, {
      name: 'Add note',
      sref: 'notes.add'
    }
  ];
}]);

app.controller('AllNotesController', ['$scope', 'Note', function ($scope, Note) {
  $scope.notes = Note.find({
    filter: {
      include: [
        'owner'
      ]
    }
  });
}]);

app.controller('AddNoteController', ['$scope', 'Note',
  '$state', function ($scope, Note, $state) {
    $scope.action = 'Add';
    $scope.note = {};
    $scope.isDisabled = false;

    $scope.submitForm = function () {
      Note.create({
        title: $scope.note.title,
        body: $scope.note.body
      })
        .$promise
        .then(function () {
          $state.go('notes.list');
        });
    };
  }]);

app.controller('DeleteNoteController', ['$scope', 'Note', '$state',
  '$stateParams', function ($scope, Note, $state, $stateParams) {
    Note
      .deleteById({id: $stateParams.id})
      .$promise
      .then(function () {
        $state.go('notes.list');
      });
  }]);

app.controller('EditNoteController', ['$scope', '$q', 'Note',
  '$stateParams', '$state', function ($scope, $q, Note,
                                      $stateParams, $state) {
    $scope.action = 'Edit';
    $scope.note = {};
    $scope.isDisabled = true;

    $q.all([
      Note.findById({id: $stateParams.id}).$promise
    ])
      .then(function (data) {
        $scope.note = data[0];
      });

    $scope.submitForm = function () {
      $scope.note
        .$save()
        .then(function (note) {
          $state.go('notes.list');
        });
    };
  }]);

app.controller('ViewNoteController', ['$scope', '$q', 'Note', '$stateParams', '$state', function ($scope, $q, Note, $stateParams, $state) {
  $scope.note = {};

  $q.all([
    Note.findOne({
      filter: {
        where: {
          id: $stateParams.id
        },
        include: [
          'owner'
        ]
      }
    }).$promise
  ]).then(function (data) {
    $scope.note = data[0];
  });

}]);

app.controller('MyNotesController', ['$scope', 'Note', '$rootScope',
  function ($scope, Note, $rootScope) {
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
