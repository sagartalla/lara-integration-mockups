(function() {

  angular.module('ccDirectives', []).directive('goodClassword', [
    '$http', function($http) {
      return {
        require: 'ngModel',
        link: function($scope, element, attrs, ngModel) {
          return ngModel.$asyncValidators.goodClassword = function(class_word) {
            return $http.get("" + API_V1.CLASSWORD + "?class_word=" + class_word);
          };
        }
      };
    }
  ]).directive('usernameAvail', [
    '$http', function($http) {
      return {
        require: 'ngModel',
        link: function($scope, element, attrs, ngModel) {
          return ngModel.$asyncValidators.usernameAvail = function(username) {
            return $http.get("" + API_V1.LOGINS + "?username=" + username);
          };
        }
      };
    }
  ]).directive('emailAvail', [
    '$http', function($http) {
      return {
        require: 'ngModel',
        link: function($scope, element, attrs, ngModel) {
          return ngModel.$asyncValidators.emailAvail = function(email) {
            return $http.get("" + API_V1.EMAILS + "?email=" + email);
          };
        }
      };
    }
  ]).directive('nonBlank', [
    function() {
      return {
        require: 'ngModel',
        restrict: 'A',
        link: function(scope, element, attrs, ctrl) {
          return ctrl.$validators.nonBlank = function(value) {
            if (value) {
              if (value.trim) {
                return !!(value && value.trim().length > 0);
              }
              return true;
            }
            return false;
          };
        }
      };
    }
  ]).directive('match', function() {
    return {
      require: 'ngModel',
      restrict: 'A',
      scope: {
        match: '='
      },
      link: function(scope, elem, attrs, ctrl) {
        return scope.$watch('match', function(pass) {
          ctrl.$validate();
          return ctrl.$validators.match = function(valueToValidate) {
            return (ctrl.$pristine && (angular.isUndefined(valueToValidate) || valueToValidate === "")) || valueToValidate === scope.match;
          };
        });
      }
    };
  }).service('errorList', function() {
    var errors, service;
    errors = {};
    service = {
      list: errors,
      addError: function(field, value, message) {
        var _base, _ref, _ref1;
        if ((_ref = errors[field]) == null) {
          errors[field] = {};
        }
        errors[field].last_val = value;
        if ((_ref1 = (_base = errors[field]).messages) == null) {
          _base.messages = [];
        }
        if (errors[field].messages.indexOf(message) === -1) {
          return errors[field].messages.push(message);
        }
      },
      isValid: function(field, value) {
        var error;
        error = errors[field];
        if (!error) {
          return true;
        }
        if (value === error.last_val) {
          return false;
        }
        return true;
      }
    };
    return service;
  }).directive('serverErrors', [
    'errorList', function(errorList) {
      return {
        require: 'ngModel',
        restrict: 'A',
        link: function(scope, element, attrs, ctrl) {
          return scope.$watch(function() {
            return JSON.stringify(errorList.list[ctrl.$name]);
          }, function() {
            ctrl.$validators.serverErrors = function(value) {
              return errorList.isValid(ctrl.$name, ctrl.$viewValue);
            };
            return ctrl.$validate();
          });
        }
      };
    }
  ]).directive('serverErrorMessage', [
    'errorList', function(errorList) {
      return {
        restrict: 'E',
        link: function(scope, element, attrs, ctrl) {
          return scope.$watch(function() {
            return JSON.stringify(errorList.list[attrs.field]);
          }, function() {
            scope.messages = [];
            if (errorList.list[attrs.field] && errorList.list[attrs.field].messages.length > 0) {
              return scope.messages = errorList.list[attrs.field].messages;
            }
          });
        },
        template: "<div class='server-errors' ng-repeat='message in messages'>\n  <span ng-bind='message' />\n</div>"
      };
    }
  ]).directive('initialValue', [
    function() {
      return {
        restrict: 'E',
        scope: {
          ngModel: '='
        },
        link: function(scope, element, attrs, ctrl) {
          return scope.ngModel = attrs['value'];
        },
        template: ""
      };
    }
  ]);

}).call(this);
