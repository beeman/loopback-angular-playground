(function(window, angular, undefined) {'use strict';

  var module = angular.module("lbModels", []);

  module.factory(
    "Models",
    ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {

      var O = {};

      O.getModels = function() {



        return 'Hello!';
      };

      return O;
    }]);

})(window, window.angular);
