app = angular.module('app', [
  'ui.router',
  'lbServices',
  'lbModels'
]);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'views/home.html'
    })
    .state('sandbox', {
      abstract: true,
      url: '/sandbox',
      templateUrl: 'views/elements/main.html',
      controller: 'SandboxController'
    })
    .state('sandbox.index', {
      url: '',
      templateUrl: 'views/elements/pre-result.html',
      controller: 'SandboxController'
    })
    .state('reviews', {
      abstract: true,
      url: '/reviews',
      templateUrl: 'views/elements/main.html',
      controller: 'ReviewsController'
    })
    .state('reviews.list', {
      url: '',
      templateUrl: 'views/all-reviews.html',
      controller: 'AllReviewsController'
    })
    .state('reviews.mine', {
      url: '/mine',
      templateUrl: 'views/my-reviews.html',
      controller: 'MyReviewsController',
      authenticate: true
    })
    .state('reviews.add', {
      url: '/add',
      templateUrl: 'views/review-form.html',
      controller: 'AddReviewController',
      authenticate: true
    })
    .state('reviews.edit', {
      url: '/edit/:id',
      templateUrl: 'views/review-form.html',
      controller: 'EditReviewController',
      authenticate: true
    })
    .state('reviews.delete', {
      url: '/delete/:id',
      controller: 'DeleteReviewController',
      authenticate: true
    })
    .state('add-note', {
      url: '/add-note',
      templateUrl: 'views/note-form.html',
      controller: 'AddNoteController',
      authenticate: true
    })
    .state('all-notes', {
      url: '/all-notes',
      templateUrl: 'views/all-notes.html',
      controller: 'AllNotesController'
    })
    .state('edit-note', {
      url: '/edit-note/:id',
      templateUrl: 'views/note-form.html',
      controller: 'EditNoteController',
      authenticate: true
    })
    .state('delete-note', {
      url: '/delete-note/:id',
      controller: 'DeleteNoteController',
      authenticate: true
    })
    .state('forbidden', {
      url: '/forbidden',
      templateUrl: 'views/forbidden.html',
    })
    .state('login', {
      url: '/login',
      templateUrl: 'views/login.html',
      controller: 'AuthLoginController'
    })
    .state('logout', {
      url: '/logout',
      controller: 'AuthLogoutController'
    })
    .state('my-notes', {
      url: '/my-notes',
      templateUrl: 'views/my-notes.html',
      controller: 'MyNotesController',
      authenticate: true
    })
    .state('sign-up', {
      url: '/sign-up',
      templateUrl: 'views/sign-up-form.html',
      controller: 'SignUpController',
    })
    .state('sign-up-success', {
      url: '/sign-up/success',
      templateUrl: 'views/sign-up-success.html'
    });
  $urlRouterProvider.otherwise('home');
}]);

app.run(['$rootScope', '$state', function ($rootScope, $state) {
  $rootScope.$on('$stateChangeStart', function (event, next) {
    // redirect to login page if not logged in
    if (next.authenticate && !$rootScope.currentUser) {
      event.preventDefault(); //prevent current page from loading
      $state.go('forbidden');
    }
  });
}]);
