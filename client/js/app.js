app = angular.module('app', [
  'ui.router',
  'lbServices',
  'lbModels',
  'ngRoute'
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
      templateUrl: 'views/reviews/list.html',
      controller: 'AllReviewsController'
    })
    .state('reviews.mine', {
      url: '/mine',
      templateUrl: 'views/reviews/mine.html',
      controller: 'MyReviewsController',
      authenticate: true
    })
    .state('reviews.add', {
      url: '/add',
      templateUrl: 'views/reviews/form.html',
      controller: 'AddReviewController',
      authenticate: true
    })
    .state('reviews.edit', {
      url: '/edit/:id',
      templateUrl: 'views/reviews/form.html',
      controller: 'EditReviewController',
      authenticate: true
    })
    .state('reviews.delete', {
      url: '/delete/:id',
      controller: 'DeleteReviewController',
      authenticate: true
    })
    .state('users', {
      abstract: true,
      url: '/users',
      templateUrl: 'views/elements/main.html',
      controller: 'UsersController'
    })
    .state('users.list', {
      url: '',
      templateUrl: 'views/users/list.html',
      controller: 'AllUsersController'
    })
    .state('users.add', {
      url: '/add',
      templateUrl: 'views/users/form.html',
      controller: 'AddUserController',
      authenticate: true
    })
    .state('users.edit', {
      url: '/edit/:id',
      templateUrl: 'views/users/form.html',
      controller: 'EditUserController',
      authenticate: true
    })
    .state('users.view', {
      url: '/view/:id',
      templateUrl: 'views/users/view.html',
      controller: 'ViewUserController',
      authenticate: false
    })
    .state('users.delete', {
      url: '/delete/:id',
      controller: 'DeleteUserController',
      authenticate: true
    })
    .state('notes', {
      abstract: true,
      url: '/notes',
      templateUrl: 'views/elements/main.html',
      controller: 'NotesController'
    })
    .state('notes.list', {
      url: '',
      templateUrl: 'views/notes/list.html',
      controller: 'AllNotesController'
    })
    .state('notes.add', {
      url: '/add',
      templateUrl: 'views/notes/form.html',
      controller: 'AddNoteController',
      authenticate: true
    })
    .state('notes.edit', {
      url: '/edit/:id',
      templateUrl: 'views/notes/form.html',
      controller: 'EditNoteController',
      authenticate: true
    })
    .state('notes.view', {
      url: '/view/:id',
      templateUrl: 'views/notes/view.html',
      controller: 'ViewNoteController',
      authenticate: false
    })
    .state('notes.delete', {
      url: '/delete/:id',
      controller: 'DeleteNoteController',
      authenticate: true
    })
    .state('forbidden', {
      url: '/forbidden',
      templateUrl: 'views/users/forbidden.html'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'views/users/login.html',
      controller: 'AuthLoginController'
    })
    .state('logout', {
      url: '/logout',
      controller: 'AuthLogoutController'
    })
    .state('sign-up', {
      url: '/sign-up',
      templateUrl: 'views/users/sign-up-form.html',
      controller: 'SignUpController'
    })
    .state('sign-up-success', {
      url: '/sign-up/success',
      templateUrl: 'views/users/sign-up-success.html'
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

app.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
  // Intercept 401 responses and redirect to login screen
  $httpProvider.interceptors.push(function ($q, $location) {
    return {
      responseError: function (rejection) {

        console.log(rejection);
        alert(rejection.status + ' ' + rejection.statusText + "\n" + rejection.data.error.message);

        //if (rejection.status === 401) {
        //  AppAuth.currentUser = null;
        //  // save the current location so that login can redirect back
        //  $location.nextAfterLogin = $location.path();
        //
        //  if ($location.path() === '/router' || $location.path() === '/login') {
        //    console.log('401 while on router on login path');
        //  } else {
        //    if ($location.path() !== '/register') {
        //      $location.path('/login');
        //    }
        //    toasty.pop.warning({title: 'Error 401 received', msg: 'We received a 401 error from the API! Redirecting to login', sound: false});
        //  }
        //}
        //if (rejection.status === 404) {
        //  console.log(rejection);
        //  toasty.pop.error({title: 'Error 404 received', msg: rejection.data.error.message, sound: false});
        //}
        //if (rejection.status === 422) {
        //  console.log(rejection);
        //  toasty.pop.error({title: 'Error 422 received', msg: rejection.data.error.message, sound: false});
        //}
        //if (rejection.status === 0) {
        //  $location.path('/');
        //  toasty.pop.error({title: 'Connection Refused', msg: 'The connection to the API is refused. Please verify that the API is running!', sound: false});
        //}
        return $q.reject(rejection);
      }
    };
  });
}]);
