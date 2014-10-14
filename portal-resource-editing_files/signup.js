(function() {

  angular.module("registrationApp", ["ccDirectives", 'ui.select', 'ui.validate', "ngMessages"]).controller("RegistrationController", [
    '$scope', '$http', '$log', 'errorList', function($scope, $http, $log, errorList) {
      var self;
      self = this;
      self.questions = [];
      self.security_questions = [];
      self.serverErrors = errorList.list;
      self.editSchool = false;
      self.addError = function() {
        return errorList.addError('first_name', self.last_name, 'message');
      };
      self.loadCountries = function() {
        return self.loadRemoteCollection('countries');
      };
      self.loadStates = function() {
        return self.loadRemoteCollection('states');
      };
      self.loadSecurityQuestions = function() {
        return self.loadRemoteCollection('security_questions');
      };
      self.loadDisrticts = function() {
        var params;
        params = {
          state: self.state
        };
        return self.loadRemoteCollection('districts', params);
      };
      self.loadSchools = function(success_fn) {
        if (success_fn == null) {
          success_fn = null;
        }
        if (self.isDomestic()) {
          return self.loadDomesticSchools(success_fn);
        } else {
          return self.loadIntlSchools(success_fn);
        }
      };
      self.loadDomesticSchools = function(success_fn) {
        var params;
        if (success_fn == null) {
          success_fn = null;
        }
        params = {
          district_id: self.district.id
        };
        return self.loadRemoteCollection('schools', params, success_fn);
      };
      self.loadIntlSchools = function(success_fn) {
        var params;
        if (success_fn == null) {
          success_fn = null;
        }
        params = {
          country_id: self.country.id
        };
        return self.loadRemoteCollection('schools', params, success_fn);
      };
      self.countrySelected = function() {
        if (self.isDomestic()) {
          self.loadStates();
        } else {
          self.loadSchools();
        }
        delete self.state;
        delete self.district;
        return delete self.school;
      };
      self.stateSelected = function() {
        if (self.isDomestic()) {
          self.loadDisrticts();
          delete self.district;
          return delete self.school;
        }
      };
      self.districtSelected = function() {
        if (self.isDomestic()) {
          self.loadDomesticSchools();
        }
        return delete self.school;
      };
      self.loadRemoteCollection = function(collectionName, params, success_fn) {
        var url;
        if (params == null) {
          params = {};
        }
        if (success_fn == null) {
          success_fn = null;
        }
        url = API_V1[collectionName.toUpperCase()];
        return $http({
          method: 'GET',
          url: url,
          params: params
        }).success(function(data, status, headers, config) {
          $log.log("loaded " + collectionName + " collection from " + url);
          self[collectionName] = data;
          if (success_fn) {
            return success_fn();
          }
        }).error(function(data, status) {
          $log.log("Error loading " + collectionName + " collection");
          return self[collectionName] || (self[collectionName] = []);
        });
      };
      self.postToResource = function(resourceName, data, successCall, failCall) {
        var url;
        if (data == null) {
          data = {};
        }
        url = API_V1[resourceName.toUpperCase()];
        return $http({
          method: 'POST',
          url: url,
          data: data
        }).success(function(data, status, headers, config) {
          $log.log("added " + resourceName + " to " + url);
          self[resourceName] = data;
          if (successCall) {
            return successCall(data);
          }
        }).error(function(data, status) {
          var errrorfields, item;
          $log.log("Error posting " + resourceName + " collection");
          errrorfields = data.message;
          self.errors = [];
          for (item in errrorfields) {
            $log.log("Error in " + item);
            errorList.addError(item, self[item], errrorfields[item]);
          }
          if (failCall) {
            return failCall(data);
          }
        });
      };
      self.uniqueQuestions = function(value) {
        var _ref;
        if (!(value && value.length > 0)) {
          return true;
        }
        return (_ref = self.questions.indexOf(value) === -1) != null ? _ref : {
          "true": false
        };
      };
      self.schoolValid = function() {
        var school_prop, _i, _len, _ref, _ref1;
        if ((_ref = self.school) == null) {
          self.school = {};
        }
        if (self.isDomestic()) {
          return self.school.name && self.school.name.length > 0;
        }
        _ref1 = [self.school.name, self.state, self.school.city];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          school_prop = _ref1[_i];
          if (!(school_prop && school_prop.length > 0)) {
            return false;
          }
        }
        return true;
      };
      self.readyToRegister = function() {
        return self.first_name && self.last_name && self.password_confirmation && self.registrationType;
      };
      self.sendRegistration = function() {
        var resource;
        resource = "" + self.registrationType + "s";
        return self.postToResource(resource, self.form_params(), function(data) {
          var field, _results;
          self.did_finish = true;
          _results = [];
          for (field in data) {
            _results.push(self[field] = data[field]);
          }
          return _results;
        });
      };
      self.sendSchool = function() {
        var data, resource;
        resource = "schools";
        data = {
          school_name: self.school.name,
          country_id: self.country.id,
          state: self.state,
          city: self.school.city
        };
        if (self.district) {
          data['district_id'] = self.district.id;
        }
        return self.postToResource(resource, data, function(returnData) {
          var id;
          id = returnData['school_id'];
          return self.loadSchools(function() {
            var school, _i, _len, _ref;
            _ref = self.schools;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              school = _ref[_i];
              if (school.id === id) {
                self.school = school;
              }
            }
            return self.editSchool = false;
          });
        });
      };
      self.form_params = function() {
        var data;
        data = {
          'first_name': self.first_name,
          'last_name': self.last_name,
          'password': self.password,
          'password_confirmation': self.password_confirmation,
          'email': self.email,
          'login': self.login,
          'class_word': self.class_word,
          'answers': self.answers,
          'questions': self.questions
        };
        if (self.school) {
          data['school_id'] = self.school.id;
        }
        return data;
      };
      self.startRegistration = function() {
        self.didStartRegistration = true;
        if (self.registrationType === "teacher") {
          self.loadCountries();
        }
        if (self.registrationType === "student") {
          return self.loadSecurityQuestions();
        }
      };
      self.nowShowing = function() {
        if (!self.didStartRegistration) {
          return "page1";
        }
        if (self.did_finish) {
          return "success";
        }
        return self.registrationType;
      };
      self.isInternational = function() {
        return !self.isDomestic();
      };
      self.isDomestic = function() {
        if (!self.country) {
          return false;
        }
        if (self.country.name !== "United States") {
          return false;
        }
        return true;
      };
      self.showState = function() {
        return self.isDomestic();
      };
      self.showDistrict = function() {
        return self.showState() && self.state;
      };
      self.showSchool = function() {
        if (!self.country) {
          return false;
        }
        return (self.showDistrict() && self.district) || (!self.isDomestic());
      };
      self.disableSubmit = function(form_valid) {
        if (self.editSchool) {
          return true;
        }
        return !form_valid;
      };
      self.setEditSchool = function() {
        return self.editSchool = true;
      };
      self.setPickSchool = function() {
        return self.editSchool = false;
      };
      return self.schoolEditmode = function() {
        if (self.editSchool) {
          if (self.isDomestic()) {
            return "us_edit";
          }
          return "intl_edit";
        } else {
          return "dropdown";
        }
      };
    }
  ]);

}).call(this);
