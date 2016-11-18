(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var app;

app = angular.module("oauthd", ["ui.router", 'ui.bootstrap']).config([
  "$stateProvider", "$urlRouterProvider", "$locationProvider", function($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider.state('login', {
      url: '/login',
      templateUrl: '/templates/login.html',
      controller: 'LoginCtrl'
    });
    $stateProvider.state('dashboard', {
      url: '/',
      templateUrl: '/templates/dashboard.html',
      controller: 'DashboardCtrl'
    });
    $stateProvider.state('dashboard.home', {
      url: 'home',
      templateUrl: '/templates/dashboard/home.html',
      controller: 'HomeCtrl'
    });
    $stateProvider.state('dashboard.apps', {
      url: 'apps',
      abstract: true,
      templateUrl: '/templates/apps.html',
      controller: 'AppsCtrl'
    });
    $stateProvider.state('dashboard.apps.create', {
      url: '/new',
      templateUrl: '/templates/app-create.html',
      controller: 'AppCreateCtrl'
    });
    $stateProvider.state('dashboard.apps.all', {
      url: '/all',
      templateUrl: '/templates/apps-list.html',
      controller: 'AppsIndexCtrl'
    });
    $stateProvider.state('dashboard.apps.show', {
      url: '/:key',
      templateUrl: '/templates/app-show.html',
      controller: 'AppShowCtrl'
    });
    $stateProvider.state('dashboard.apps.new_keyset', {
      url: '/:key/addProvider',
      templateUrl: '/templates/app-new-keyset.html',
      controller: 'AppProviderListCtrl'
    });
    $stateProvider.state('dashboard.apps.keyset', {
      url: '/:key/:provider',
      templateUrl: '/templates/app-keyset.html',
      controller: 'AppKeysetCtrl'
    });
    $stateProvider.state('dashboard.plugins', {
      url: 'plugins/:plugin',
      templateUrl: '/templates/plugins/show.html',
      controller: 'PluginShowCtrl'
    });
    $stateProvider.state('dashboard.help', {
      url: 'help',
      templateUrl: '/templates/help.html',
      controller: 'HelpCtrl'
    });
    $urlRouterProvider.when("", "dashboard.home");
    $urlRouterProvider.otherwise('/login');
    return $locationProvider.html5Mode(true);
  }
]);

require('./filters/filters')(app);

require('./directives/DomainsDir')(app);

require('./directives/KeysetDir')(app);

require('./directives/AppThumb')(app);

require('./services/AppService')(app);

require('./services/KeysetService')(app);

require('./services/PluginService')(app);

require('./services/ProviderService')(app);

require('./services/UserService')(app);

require('./services/ConfigService')(app);

require('./controllers/DashboardCtrl')(app);

require('./controllers/HomeCtrl')(app);

require('./controllers/LoginCtrl')(app);

require('./controllers/AppsCtrl')(app);

require('./controllers/Apps/AppShowCtrl')(app);

require('./controllers/Apps/AppCreateCtrl')(app);

require('./controllers/Apps/AppsIndexCtrl')(app);

require('./controllers/Apps/AppKeysetCtrl')(app);

require('./controllers/Apps/AppTryModalCtrl')(app);

require('./controllers/Apps/AppProviderListCtrl')(app);

require('./controllers/HelpCtrl')(app);

require('./controllers/Plugins/PluginShowCtrl')(app);

app.run([
  "$rootScope", "UserService", function($rootScope, UserService) {
    window.scope = $rootScope;
    $rootScope.loading = true;
    $rootScope.logged_user = amplify.store('user');
    $rootScope.accessToken = amplify.store('accessToken');
    $rootScope.loginData = amplify.store('loginData');
    $rootScope.$watch('logged_user', function() {
      if (($rootScope.logged_user != null)) {
        return amplify.store('user', $rootScope.logged_user);
      } else {
        return amplify.store('user', null);
      }
    });
    $rootScope.$watch('accessToken', function() {
      if (($rootScope.accessToken != null)) {
        return amplify.store('accessToken', $rootScope.accessToken);
      } else {
        return amplify.store('accessToken', null);
      }
    });
    $rootScope.$watch('loginData', function() {
      if (($rootScope.loginData != null)) {
        return amplify.store('loginData', $rootScope.loginData);
      } else {
        return amplify.store('loginData', null);
      }
    });
    return $rootScope.logout = function() {
      return UserService.logout();
    };
  }
]);

},{"./controllers/Apps/AppCreateCtrl":2,"./controllers/Apps/AppKeysetCtrl":3,"./controllers/Apps/AppProviderListCtrl":4,"./controllers/Apps/AppShowCtrl":5,"./controllers/Apps/AppTryModalCtrl":6,"./controllers/Apps/AppsIndexCtrl":7,"./controllers/AppsCtrl":8,"./controllers/DashboardCtrl":9,"./controllers/HelpCtrl":10,"./controllers/HomeCtrl":11,"./controllers/LoginCtrl":12,"./controllers/Plugins/PluginShowCtrl":13,"./directives/AppThumb":14,"./directives/DomainsDir":15,"./directives/KeysetDir":16,"./filters/filters":17,"./services/AppService":18,"./services/ConfigService":19,"./services/KeysetService":20,"./services/PluginService":21,"./services/ProviderService":22,"./services/UserService":23}],2:[function(require,module,exports){
module.exports = function(app) {
  return app.controller('AppCreateCtrl', [
    '$state', '$scope', '$rootScope', '$location', 'UserService', '$stateParams', 'AppService', function($state, $scope, $rootScope, $location, UserService, $stateParams, AppService) {
      $scope.app = {};
      $scope.setTitle('Create an app');
      $scope.domains_control = {};
      return $scope.create = function() {
        return AppService.create($scope.app).then(function(app) {
          $state.go('dashboard.apps.show', {
            key: app.key
          });
        }).fail(function(e) {
          console.error(e);
        });
      };
    }
  ]);
};

},{}],3:[function(require,module,exports){
module.exports = function(app) {
  return app.controller('AppKeysetCtrl', [
    '$state', '$scope', '$rootScope', '$location', 'UserService', '$stateParams', 'AppService', 'ProviderService', 'KeysetService', function($state, $scope, $rootScope, $location, UserService, $stateParams, AppService, ProviderService, KeysetService) {
      $scope.keyset = {
        parameters: {}
      };
      $scope.keysetEditorControl = {};
      $scope.provider = $stateParams.provider;
      $scope.changed = false;
      AppService.get($stateParams.key).then(function(app) {
        $scope.app = app;
        $scope.setApp(app);
        $scope.setProvider($stateParams.provider);
        return $scope.$apply();
      }).fail(function(e) {
        return console.error(e);
      });
      KeysetService.get($stateParams.key, $scope.provider).then(function(keyset) {
        var k, ref, v;
        $scope.keyset = keyset;
        $scope.original = {};
        ref = $scope.keyset.parameters;
        for (k in ref) {
          v = ref[k];
          $scope.original[k] = v;
        }
        $scope.keysetEditorControl.setKeyset($scope.keyset);
      }).fail(function(e) {
        return $scope.keysetEditorControl.setKeyset($scope.keyset);
      });
      $scope.save = function() {
        var keyset;
        keyset = $scope.keysetEditorControl.getKeyset();
        return KeysetService.save($scope.app.key, $stateParams.provider, keyset.parameters).then(function(data) {
          return $state.go('dashboard.apps.show', {
            key: $stateParams.key
          });
        }).fail(function(e) {
          return console.error(e);
        });
      };
      $scope["delete"] = function() {
        if (confirm('Are you sure you want to delete this keyset?')) {
          return KeysetService.del($scope.app.key, $stateParams.provider).then(function(data) {
            return $state.go('dashboard.apps.show', {
              key: $stateParams.key
            });
          }).fail(function(e) {
            return console.error(e);
          });
        }
      };
      ProviderService.getProviderSettings($stateParams.provider).then(function(settings) {
        return $scope.settings = settings;
      }).fail(function(e) {
        return consoe.log('e', e);
      });
      return $scope.keysetEditorControl.change = function() {
        $scope.changed = !angular.equals($scope.original, $scope.keysetEditorControl.getKeyset().parameters);
        return $scope.$apply();
      };
    }
  ]);
};

},{}],4:[function(require,module,exports){
module.exports = function(app) {
  return app.controller('AppProviderListCtrl', [
    '$state', '$scope', '$rootScope', '$location', '$timeout', '$filter', 'UserService', '$stateParams', 'AppService', 'ProviderService', 'KeysetService', function($state, $scope, $rootScope, $location, $timeout, $filter, UserService, $stateParams, AppService, ProviderService, KeysetService) {
      $scope.loadingProviders = true;
      AppService.get($stateParams.key).then(function(app) {
        $scope.app = app;
        $scope.setApp(app);
        $scope.setProvider('Add a provider');
        return $scope.$apply();
      }).fail(function(e) {
        return console.error(e);
      });
      ProviderService.getAll().then(function(providers) {
        $scope.providers = providers;
        $scope.selectedProviders = providers;
        return $scope.$apply();
      }).fail(function(e) {
        return console.error(e);
      })["finally"](function() {
        $scope.loadingProviders = false;
        return $scope.$apply();
      });
      return $scope.queryChange = function() {
        return $timeout((function() {
          $scope.loadingProviders = true;
          $scope.selectedProviders = $scope.providers;
          if ($scope.query) {
            if ($scope.query.name && $scope.query.name !== "") {
              $scope.selectedProviders = $filter('filter')($scope.selectedProviders, {
                name: $scope.query.name
              });
            }
          }
          return $scope.loadingProviders = false;
        }), 500);
      };
    }
  ]);
};

},{}],5:[function(require,module,exports){
var async;

async = require('async');

module.exports = function(app) {
  return app.controller('AppShowCtrl', [
    '$state', '$scope', '$rootScope', '$location', '$modal', 'UserService', '$stateParams', 'AppService', function($state, $scope, $rootScope, $location, $modal, UserService, $stateParams, AppService) {
      var timeout, timeoute;
      $scope.domains_control = {};
      $scope.error = void 0;
      $scope.setProvider(void 0);
      $scope.backend = {};
      $scope.original_backend = {};
      $scope.changed = false;
      $scope.$watch('backend', function() {
        if (!angular.equals($scope.backend, $scope.original_backend)) {
          $scope.changed = true;
        }
        return $scope.appModified(!angular.equals($scope.backend, $scope.original_backend));
      }, true);
      $scope.show_secret = false;
      $scope.getAppInfo = function(show_secret) {
        $scope.show_secret = show_secret;
        return AppService.get($stateParams.key).then(function(app) {
          if (!show_secret) {
            app.secret = '••••••••••••••••';
          }
          $scope.app = app;
          $scope.setApp(app);
          $scope.error = void 0;
          $scope.$apply();
          return $scope.domains_control.refresh();
        }).fail(function(e) {
          console.error(e);
          return $scope.error = e.message;
        });
      };
      $scope.getAppInfo(false);
      $scope.resetKeys = function() {
        if (confirm('Are you sure you want to reset this app\'s keys? This will break the code using these keys.')) {
          return AppService.resetKeys($stateParams.key).then(function(data) {
            return $state.go('dashboard.apps.show', {
              key: data.key
            });
          }).fail(function() {
            console.error(e);
            return $scope.error = e.message;
          });
        }
      };
      AppService.getBackend($stateParams.key).then(function(backend) {
        var k, ref, ref1, v;
        $scope.original_backend = {};
        $scope.original_backend.name = backend != null ? backend.name : void 0;
        if (!((ref = $scope.original_backend) != null ? ref.name : void 0)) {
          $scope.original_backend.name = 'none';
        }
        $scope.backend = {};
        ref1 = $scope.original_backend;
        for (k in ref1) {
          v = ref1[k];
          $scope.backend[k] = v;
        }
        return $scope.$apply();
      }).fail(function(e) {
        return console.error(e);
      });
      $scope.saveApp = function() {
        $scope.changed = false;
        $scope.appModified(false);
        return async.series([
          function(cb) {
            return AppService.update($scope.app).then(function() {
              return cb();
            }).fail(function(e) {
              console.error(e);
              $scope.error = e.message;
              return cb(e);
            });
          }, function(cb) {
            var ref;
            return AppService.setBackend($stateParams.key, (ref = $scope.backend) != null ? ref.name : void 0).then(function() {
              return cb();
            }).fail(function(e) {
              return cb(e);
            });
          }
        ], function(err) {
          if (err) {
            $scope.error = "A problem occured while saving the app";
          }
          if (err) {
            $scope.changed = true;
          }
          if (err) {
            $scope.appModified(true);
          }
          $scope.success = "Successfully saved changes";
          return $scope.$apply();
        });
      };
      $scope.deleteApp = function() {
        if (confirm('Are you sure you want to delete this app?')) {
          return AppService.del($scope.app).then(function() {
            $state.go('dashboard.apps.all');
            return $scope.error = void 0;
          }).fail(function(e) {
            console.error(e);
            return $scope.error = e.message;
          });
        }
      };
      timeout = void 0;
      $scope.$watch('success', function() {
        clearTimeout(timeout);
        if ($scope.success !== void 0) {
          return timeout = setTimeout(function() {
            $scope.success = void 0;
            return $scope.$apply();
          }, 3000);
        }
      });
      timeoute = void 0;
      $scope.$watch('error', function() {
        clearTimeout(timeoute);
        if ($scope.error !== void 0) {
          return timeoute = setTimeout(function() {
            $scope.error = void 0;
            return $scope.$apply();
          }, 3000);
        }
      });
      $scope.domains_control.change = function() {
        $scope.changed = true;
        $scope.appModified(true);
        return $scope.$apply();
      };
      return $scope.tryAuth = function(provider, key) {
        var params, ref, type;
        OAuth.setOAuthdURL(window.location.origin);
        OAuth.initialize(key);
        type = 'client';
        if (((ref = $scope.app.backend) != null ? ref.name : void 0) === 'firebase') {
          type = 'baas';
        }
        if ($scope.app.backend && $scope.app.backend.name !== 'firebase') {
          type = 'server';
        }
        params = {};
        if (type === 'server') {
          params.state = 'azerty';
        }
        return OAuth.popup(provider, params, function(err, res) {
          var instance;
          if (err) {
            instance = $modal.open({
              templateUrl: '/templates/dashboard/modals/try-error.html',
              controller: 'AppTryModalCtrl',
              resolve: {
                success: function() {
                  return res;
                },
                err: function() {
                  return err && err.message || JSON.stringify(err);
                },
                provider: function() {
                  return provider;
                },
                key: function() {
                  return key;
                },
                type: function() {
                  return type;
                },
                backend: function() {
                  var ref1;
                  return (ref1 = $scope.app.backend) != null ? ref1.name : void 0;
                }
              }
            });
            console.error(err);
            return false;
          }
          return instance = $modal.open({
            templateUrl: '/templates/dashboard/modals/try-success.html',
            controller: 'AppTryModalCtrl',
            resolve: {
              success: function() {
                return res;
              },
              err: function() {
                return err;
              },
              provider: function() {
                return provider;
              },
              key: function() {
                return key;
              },
              type: function() {
                return type;
              },
              backend: function() {
                var ref1;
                return (ref1 = $scope.app.backend) != null ? ref1.name : void 0;
              }
            }
          });
        });
      };
    }
  ]);
};

},{"async":25}],6:[function(require,module,exports){
module.exports = function(app) {
  return app.controller('AppTryModalCtrl', [
    '$scope', '$rootScope', '$modalInstance', 'success', 'err', 'provider', 'key', 'type', 'backend', function($scope, $rootScope, $modalInstance, success, err, provider, key, type, backend) {
      $scope.success = success;
      $scope.err = err;
      $scope.provider = provider;
      $scope.key = key;
      $scope.type = type;
      $scope.backend = backend;
      return $scope.close = function() {
        return $modalInstance.dismiss();
      };
    }
  ]);
};

},{}],7:[function(require,module,exports){
var async;

async = require('async');

module.exports = function(app) {
  return app.controller('AppsIndexCtrl', [
    '$state', '$scope', '$rootScope', '$location', 'UserService', '$stateParams', 'AppService', function($state, $scope, $rootScope, $location, UserService, $stateParams, AppService) {
      var reloadApps;
      $scope.clearArianne();
      $scope.loadingApps = true;
      $scope.apps = [];
      reloadApps = function() {
        return AppService.all().then(function(apps) {
          return async.each(apps, function(app, cb) {
            return AppService.get(app.key).then(function(a) {
              $scope.apps.push(a);
              return cb();
            }).fail(function(e) {
              return console.error(e);
            });
          }, function(err) {
            return $scope.$apply();
          });
        }).fail(function(e) {
          return console.error(e);
        })["finally"](function() {
          $scope.loadingApps = false;
          return $scope.$apply();
        });
      };
      reloadApps();
      return $scope.deleteApp = function(key) {
        if (confirm('Are you sure you want to delete this app?')) {
          return AppService.del({
            key: key
          }).then(function() {
            return reloadApps();
          }).fail(function() {
            return console.error(e);
          });
        }
      };
    }
  ]);
};

},{"async":25}],8:[function(require,module,exports){
module.exports = function(app) {
  return app.controller('AppsCtrl', [
    '$state', '$scope', '$rootScope', '$location', function($state, $scope, $rootScope, $location, UserService) {
      $scope.setApp = function(app) {
        return $scope.app = app;
      };
      $scope.getApp = function() {
        return $scope.app;
      };
      $scope.setProvider = function(provider) {
        return $scope.provider_name = provider;
      };
      $scope.setTitle = function(title) {
        return $scope.pagetitle = title;
      };
      $scope.clearArianne = function() {
        $scope.app = void 0;
        return $scope.provider_name = void 0;
      };
      return $scope.appModified = function(v) {
        return $scope.app_changed = v;
      };
    }
  ]);
};

},{}],9:[function(require,module,exports){
var async;

async = require('async');

module.exports = function(app) {
  return app.controller('DashboardCtrl', [
    '$state', '$scope', '$rootScope', '$location', 'UserService', 'AppService', 'PluginService', function($state, $scope, $rootScope, $location, UserService, AppService, PluginService) {
      var ref;
      if (($rootScope.accessToken == null) || ((ref = $rootScope.loginData) != null ? ref.expires : void 0) < new Date().getTime()) {
        $state.go('login');
      }
      PluginService.getAll().then(function(plugins) {
        var k, v;
        $scope.plugins = plugins;
        $scope.interface_enabled = 0;
        for (k in plugins) {
          v = plugins[k];
          if (v.interface_enabled) {
            $scope.interface_enabled++;
          }
        }
        return $scope.$apply();
      }).fail(function(e) {
        return console.error(e);
      });
      return $scope.state = $state;
    }
  ]);
};

},{"async":25}],10:[function(require,module,exports){
var async;

async = require('async');

module.exports = function(app) {
  return app.controller('HelpCtrl', [
    '$scope', '$state', '$rootScope', 'ConfigService', function($scope, $state, $rootScope, ConfigService) {
      return ConfigService.getConfig().then(function(config) {
        return $scope.config = config;
      }).fail(function(e) {
        return console.error(e);
      })["finally"](function() {
        return $scope.$apply();
      });
    }
  ]);
};

},{"async":25}],11:[function(require,module,exports){
var async;

async = require('async');

module.exports = function(app) {
  return app.controller('HomeCtrl', [
    '$scope', '$state', '$rootScope', '$location', 'UserService', 'AppService', 'PluginService', 'ConfigService', function($scope, $state, $rootScope, $location, UserService, AppService, PluginService, ConfigService) {
      var initCtrl;
      $scope.count = function(object) {
        var count, k, v;
        count = 0;
        for (k in object) {
          v = object[k];
          count++;
        }
        return count;
      };
      initCtrl = function() {
        $scope.providers = {};
        $scope.loadingApps = true;
        AppService.all().then(function(apps) {
          $scope.apps = apps;
          return async.eachSeries(apps, function(app, next) {
            return AppService.get(app.key).then(function(app_data) {
              var j, k, ref, v;
              for (j in app_data) {
                app[j] = app_data[j];
              }
              ref = app_data.keysets;
              for (k in ref) {
                v = ref[k];
                $scope.providers[v] = true;
              }
              return next();
            }).fail(function(e) {
              console.error(e);
              return next();
            });
          }, function(err) {
            return $scope.$apply();
          });
        }).fail(function(e) {
          return console.error(e);
        })["finally"](function() {
          $scope.loadingApps = false;
          return $scope.$apply();
        });
        PluginService.getAll().then(function(plugins) {
          var i, len, plugin, results;
          $scope.plugins = [];
          results = [];
          for (i = 0, len = plugins.length; i < len; i++) {
            plugin = plugins[i];
            plugin.url = "/oauthd/plugins/" + plugin.name;
            results.push($scope.plugins.push(plugin));
          }
          return results;
        }).fail(function(e) {
          return console.error(e);
        })["finally"](function() {
          return $scope.$apply();
        });
        $scope.loadingConfig = true;
        return ConfigService.getConfig().then(function(config) {
          return $scope.config = config;
        }).fail(function(e) {
          return console.error(e);
        })["finally"](function() {
          $scope.loadingConfig = false;
          return $scope.$apply();
        });
      };
      return initCtrl();
    }
  ]);
};

},{"async":25}],12:[function(require,module,exports){
module.exports = function(app) {
  return app.controller('LoginCtrl', [
    '$state', '$scope', '$rootScope', '$location', 'UserService', function($state, $scope, $rootScope, $location, UserService) {
      var initCtrl, login;
      initCtrl = function() {
        $scope.error = void 0;
        $scope.user = {};
        return $('#emailInput').focus();
      };
      login = function(cb) {
        return UserService.login({
          email: $scope.user.email,
          pass: $scope.user.pass
        }).then(function(user) {
          $state.go('dashboard.home');
        }).fail(function(e) {
          $scope.error = e;
          $scope.$apply();
        })["finally"](function() {
          return cb(null);
        });
      };
      $scope.submit = function(form) {
        if (form.$name === "loginForm") {
          $scope.loginSubmitted = true;
        }
        if (form.$invalid) {
          return;
        }
        return login(function(cb) {
          return $scope.loginSubmitted = false;
        });
      };
      return initCtrl();
    }
  ]);
};

},{}],13:[function(require,module,exports){
module.exports = function(app) {
  return app.controller('PluginShowCtrl', [
    '$state', '$scope', '$stateParams', 'PluginService', function($state, $scope, $stateParams, PluginService) {
      if (!$stateParams.plugin || $stateParams.plugin === "") {
        $state.go('home');
      }
      return PluginService.get($stateParams.plugin).then(function(plugin) {
        if (plugin.interface_enabled) {
          plugin.url = "/plugins/" + plugin.name + '/index.html';
        }
        return $scope.plugin = plugin;
      }).fail(function(e) {
        return console.error(e);
      })["finally"](function() {
        return $scope.$apply();
      });
    }
  ]);
};

},{}],14:[function(require,module,exports){
module.exports = function(app) {
  return app.directive('appthumb', [
    "$rootScope", function($rootScope) {
      return {
        restrict: 'AE',
        templateUrl: '/templates/apps/thumb.html',
        replace: true,
        scope: {
          app: '='
        },
        link: function($scope, $element) {}
      };
    }
  ]);
};

},{}],15:[function(require,module,exports){
module.exports = function(app) {
  return app.directive('domains', [
    "$rootScope", function($rootScope) {
      return {
        restrict: 'AE',
        templateUrl: '/templates/domains_chooser.html',
        replace: true,
        scope: {
          control: '=',
          app: '='
        },
        link: function($scope, $element) {
          var add_listener, k, ref, ref1, remove_listener, selectize_elem, v;
          selectize_elem = $($element[0]).selectize({
            delimiter: ' ',
            persist: false,
            create: function(input) {
              return {
                value: input,
                text: input
              };
            }
          });
          $scope.selectize = selectize_elem[0].selectize;
          $scope.control.getSelectize = function() {
            return $scope.selectize;
          };
          $scope.control.getDomains = function() {
            var domains, value;
            value = $scope.selectize.getValue();
            domains = value.split(' ');
            return domains;
          };
          if (((ref = $scope.app) != null ? ref.domains : void 0) != null) {
            ref1 = $scope.app.domains;
            for (k in ref1) {
              v = ref1[k];
              $scope.selectize.addOption({
                text: v,
                value: v
              });
              $scope.selectize.addItem(v);
            }
          }
          add_listener = function() {
            return $scope.selectize.on('change', function() {
              var domains, value;
              value = $scope.selectize.getValue();
              domains = value.split(' ');
              $scope.app.domains = domains;
              if ($scope.control.change != null) {
                return $scope.control.change();
              }
            });
          };
          remove_listener = function() {
            return $scope.selectize.off('change');
          };
          $scope.control.refresh = function(app) {
            var i, len, ref2;
            remove_listener();
            $scope.selectize.clear();
            if (app != null) {
              $scope.app = app;
            }
            ref2 = $scope.app.domains;
            for (i = 0, len = ref2.length; i < len; i++) {
              v = ref2[i];
              $scope.selectize.addOption({
                text: v,
                value: v
              });
              $scope.selectize.addItem(v);
            }
            return add_listener();
          };
          add_listener();
        }
      };
    }
  ]);
};

},{}],16:[function(require,module,exports){
module.exports = function(app) {
  return app.directive('keyseteditor', [
    '$rootScope', 'ProviderService', 'KeysetService', function($rootScope, ProviderService, KeysetService) {
      return {
        restrict: 'AE',
        template: '<div></div>',
        replace: true,
        scope: {
          provider: '=',
          control: '='
        },
        link: function($scope, $element) {
          var $elt, update;
          $elt = $($element[0]);
          $scope.control = $scope.control;
          update = function() {
            return ProviderService.get($scope.provider).then(function(config) {
              var field, input, k, kk, param_config, ref, ref1, ref2, ref3, ref4, ref5, ref6, results, selectize, values, vv;
              $scope.available_parameters = (config != null ? (ref = config.oauth2) != null ? ref.parameters : void 0 : void 0) || (config != null ? (ref1 = config.oauth1) != null ? ref1.parameters : void 0 : void 0) || (config != null ? config.parameters : void 0);
              $elt.html('');
              results = [];
              for (k in $scope.available_parameters) {
                param_config = $scope.available_parameters[k];
                field = $(document.createElement('div'));
                $elt.append(field);
                field.append('<div><strong>' + k + '</strong></div>');
                if (((ref2 = $scope.available_parameters[k]) != null ? ref2.values : void 0) != null) {
                  values = [];
                  for (kk in $scope.available_parameters[k].values) {
                    vv = $scope.available_parameters[k].values[kk];
                    values.push({
                      name: kk,
                      value: vv
                    });
                  }
                  if ((param_config.cardinality != null) && param_config.cardinality === '*') {
                    input = $(document.createElement('input'));
                    field.append(input);
                    input.val((ref3 = $scope.keyset) != null ? (ref4 = ref3.parameters) != null ? ref4[k] : void 0 : void 0);
                    selectize = input.selectize({
                      delimiter: ' ',
                      persist: true,
                      valueField: 'name',
                      labelField: 'value',
                      searchField: ['name', 'value'],
                      options: values,
                      create: true,
                      render: {
                        item: function(item, escape) {
                          return '<div><span class="name">' + item.name + '</span></div>';
                        },
                        option: function(item, escape) {
                          var desc, label;
                          label = item.name;
                          desc = item.value;
                          return '<div><div class="scope_name">' + escape(label) + '</div><div class="scope_desc">' + escape(desc) + '</div></div>';
                        },
                        create: function(input) {
                          return {
                            value: input,
                            text: input
                          };
                        }
                      }
                    });
                    (function(selectize, k) {
                      selectize = selectize[0].selectize;
                      return selectize.on('change', function() {
                        $scope.keyset.parameters[k] = this.getValue();
                        return $scope.control.change();
                      });
                    })(selectize, k);
                  }
                  if ((param_config.cardinality != null) && param_config.cardinality === '1') {
                    input = $(document.createElement('select'));
                    field.append(input);
                    selectize = input.selectize({
                      delimiter: ' ',
                      persist: true,
                      valueField: 'name',
                      labelField: 'value',
                      searchField: ['name', 'value'],
                      options: values,
                      create: true,
                      render: {
                        item: function(item, escape) {
                          return '<div><span class="name">' + item.name + '</span></div>';
                        },
                        option: function(item, escape) {
                          var desc, label;
                          label = item.name;
                          desc = item.value;
                          return '<div><div class="scope_name">' + escape(label) + '</div><div class="scope_desc">' + escape(desc) + '</div></div>';
                        },
                        create: function(input) {
                          return {
                            value: input,
                            text: input
                          };
                        }
                      }
                    });
                    results.push((function(selectize, k) {
                      var ref5, ref6;
                      selectize = selectize[0].selectize;
                      selectize.addItem((ref5 = $scope.keyset) != null ? (ref6 = ref5.parameters) != null ? ref6[k] : void 0 : void 0);
                      return selectize.on('change', function() {
                        $scope.keyset.parameters[k] = this.getValue();
                        return $scope.control.change();
                      });
                    })(selectize, k));
                  } else {
                    results.push(void 0);
                  }
                } else {
                  input = $(document.createElement('input'));
                  field.append(input);
                  input.addClass('form-control');
                  input.val((ref5 = $scope.keyset) != null ? (ref6 = ref5.parameters) != null ? ref6[k] : void 0 : void 0);
                  results.push((function(k, input) {
                    return input.change(function() {
                      $scope.keyset.parameters[k] = input.val();
                      return $scope.control.change();
                    });
                  })(k, input));
                }
              }
              return results;
            }).fail(function(e) {
              return console.error(e);
            });
          };
          if ($scope.provider != null) {
            update();
          }
          $scope.$watch('provider', function() {
            if (($scope.app != null) && ($scope.provider != null)) {
              return update();
            }
          });
          $scope.control.getKeyset = function() {
            return $scope.keyset;
          };
          return $scope.control.setKeyset = function(keyset) {
            $scope.keyset = keyset;
            return update();
          };
        }
      };
    }
  ]);
};

},{}],17:[function(require,module,exports){
module.exports = function(app) {
  app.filter('capitalize', function() {
    return function(str) {
      if (!str || !str[0]) {
        return "";
      }
      return str[0].toUpperCase() + str.substr(1);
    };
  });
  app.filter('minimize_key', function() {
    return function(str) {
      return str.substr(0, 5) + '...' + str.substr(str.length - 4, str.length - 1);
    };
  });
  return app.filter('count', function() {
    return function(object) {
      var count, k, v;
      count = 0;
      for (k in object) {
        v = object[k];
        count++;
      }
      return count;
    };
  });
};

},{}],18:[function(require,module,exports){
var Q;

Q = require('q');

module.exports = function(app) {
  return app.factory('AppService', [
    '$rootScope', '$http', function($rootScope, $http) {
      var api;
      api = require('../utilities/apiCaller')($http, $rootScope);
      return {
        all: function() {
          var defer;
          defer = Q.defer();
          api('/apps', function(data) {
            return defer.resolve(data.data);
          }, function(e) {
            return defer.reject(e);
          });
          return defer.promise;
        },
        get: function(key) {
          var defer;
          defer = Q.defer();
          api('/apps/' + key, function(data) {
            return defer.resolve(data.data);
          }, function(e) {
            return defer.reject(e);
          });
          return defer.promise;
        },
        create: function(app) {
          var defer;
          defer = Q.defer();
          api('/apps', function(data) {
            return defer.resolve(data.data);
          }, function(e) {
            return defer.reject(e);
          }, {
            method: 'POST',
            data: app
          });
          return defer.promise;
        },
        update: function(app) {
          var defer;
          defer = Q.defer();
          api('/apps/' + app.key, function(data) {
            return defer.resolve(data.data);
          }, function(e) {
            return defer.reject(e);
          }, {
            method: 'POST',
            data: app
          });
          return defer.promise;
        },
        getBackend: function(key) {
          var defer;
          defer = Q.defer();
          api('/apps/' + key + '/backend', function(data) {
            return defer.resolve(data.data);
          }, function(e) {
            return defer.reject(e);
          }, {
            method: 'GET'
          });
          return defer.promise;
        },
        setBackend: function(key, backend) {
          var defer;
          defer = Q.defer();
          if ((backend != null) && backend !== 'none') {
            api('/apps/' + key + '/backend/' + backend, function(data) {
              return defer.resolve(data.data);
            }, function(e) {
              return defer.reject(e);
            }, {
              method: 'POST'
            });
          } else {
            api('/apps/' + key + '/backend', function(data) {
              return defer.resolve(data.data);
            }, function(e) {
              return defer.reject(e);
            }, {
              method: 'DELETE'
            });
          }
          return defer.promise;
        },
        del: function(app) {
          var defer, key;
          defer = Q.defer();
          if (typeof app === 'object') {
            key = app.key;
          }
          if (typeof app === 'string') {
            key = app;
          }
          api('/apps/' + key, function(data) {
            return defer.resolve(data.data);
          }, function(e) {
            return defer.reject(e);
          }, {
            method: 'DELETE'
          });
          return defer.promise;
        },
        resetKeys: function(key) {
          var defer;
          defer = Q.defer();
          api('/apps/' + key + '/reset', function(data) {
            return defer.resolve(data.data);
          }, function(e) {
            return defer.reject(e);
          }, {
            method: 'POST'
          });
          return defer.promise;
        }
      };
    }
  ]);
};

},{"../utilities/apiCaller":24,"q":27}],19:[function(require,module,exports){
var Q;

Q = require('q');

module.exports = function(app) {
  return app.factory('ConfigService', [
    '$http', '$rootScope', '$location', function($http, $rootScope, $location) {
      var api, config_service;
      api = require('../utilities/apiCaller')($http, $rootScope);
      config_service = {
        getConfig: function() {
          var defer;
          defer = Q.defer();
          api("/config", (function(data) {
            defer.resolve(data.data);
          }), function(e) {
            defer.reject(e);
          });
          return defer.promise;
        }
      };
      return config_service;
    }
  ]);
};

},{"../utilities/apiCaller":24,"q":27}],20:[function(require,module,exports){
var Q;

Q = require('q');

module.exports = function(app) {
  return app.factory('KeysetService', [
    '$rootScope', '$http', function($rootScope, $http) {
      var api, keyset_service;
      api = require('../utilities/apiCaller')($http, $rootScope);
      keyset_service = {
        get: function(app_key, provider) {
          var defer;
          defer = Q.defer();
          api('/apps/' + app_key + '/keysets/' + provider, function(data) {
            return defer.resolve(data.data);
          }, function(e) {
            return defer.reject(e);
          });
          return defer.promise;
        },
        save: function(app_key, provider, keyset) {
          var defer;
          defer = Q.defer();
          api('/apps/' + app_key + '/keysets/' + provider, function(data) {
            return defer.resolve(data.data);
          }, function(e) {
            return defer.reject(e);
          }, {
            data: {
              parameters: keyset,
              response_type: 'token'
            }
          });
          return defer.promise;
        },
        del: function(app_key, provider) {
          var defer;
          defer = Q.defer();
          api('/apps/' + app_key + '/keysets/' + provider, function(data) {
            return defer.resolve(data.data);
          }, function(e) {
            return defer.reject(e);
          }, {
            method: 'DELETE'
          });
          return defer.promise;
        }
      };
      return keyset_service;
    }
  ]);
};

},{"../utilities/apiCaller":24,"q":27}],21:[function(require,module,exports){
var Q;

Q = require('q');

module.exports = function(app) {
  return app.factory('PluginService', [
    '$http', '$rootScope', '$location', function($http, $rootScope, $location) {
      var api, plugin_service;
      api = require('../utilities/apiCaller')($http, $rootScope);
      plugin_service = {
        getAll: function() {
          var defer;
          defer = Q.defer();
          api("/plugins", function(data) {
            return defer.resolve(data.data);
          }, function(e) {
            return defer.reject(e);
          });
          return defer.promise;
        },
        get: function(name) {
          var defer;
          defer = Q.defer();
          api("/plugins/" + name, (function(data) {
            defer.resolve(data.data);
          }), function(e) {
            defer.reject(e);
          });
          return defer.promise;
        }
      };
      return plugin_service;
    }
  ]);
};

},{"../utilities/apiCaller":24,"q":27}],22:[function(require,module,exports){
var Q;

Q = require("q");

module.exports = function(app) {
  app.factory("ProviderService", [
    "$rootScope", "$http", function($rootScope, $http) {
      var api, get_provider_conf, get_provider_settings, provider_service;
      api = require("../utilities/apiCaller")($http, $rootScope);
      get_provider_conf = function(name) {
        var defer;
        defer = Q.defer();
        api("/providers/" + name + "?extend=true", (function(data) {
          defer.resolve(data.data);
        }), function(e) {
          defer.reject(e);
        });
        return defer.promise;
      };
      get_provider_settings = function(name) {
        var defer;
        defer = Q.defer();
        api("/providers/" + name + "/settings", (function(data) {
          defer.resolve(data.data.settings);
        }), function(e) {
          defer.reject(e);
        });
        return defer.promise;
      };
      provider_service = {
        getAll: function() {
          var defer;
          defer = Q.defer();
          api("/providers", function(data) {
            return defer.resolve(data.data);
          }, function(e) {
            return defer.reject(e);
          });
          return defer.promise;
        },
        get: function(name) {
          return get_provider_conf(name);
        },
        getSettings: function(name) {
          return get_provider_settings(name);
        },
        getCurrentProvider: function() {
          return get_provider_conf($rootScope.wd.provider);
        },
        getCurrentProviderSettings: function() {
          return get_provider_settings($rootScope.wd.provider);
        },
        getProviderConfig: function(name) {
          return get_provider_conf(name);
        },
        getProviderSettings: function(name) {
          return get_provider_settings(name);
        }
      };
      return provider_service;
    }
  ]);
};

},{"../utilities/apiCaller":24,"q":27}],23:[function(require,module,exports){
var Q;

Q = require('q');

module.exports = function(app) {
  return app.factory('UserService', [
    '$http', '$rootScope', '$location', function($http, $rootScope, $location) {
      var api, user_service;
      api = require('../utilities/apiCaller')($http, $rootScope);
      user_service = {
        login: function(user) {
          var authorization, defer;
          defer = Q.defer();
          authorization = window.btoa((user != null ? user.email : void 0) + ':' + (user != null ? user.pass : void 0));
          $http({
            method: 'POST',
            url: '/signin',
            data: {
              name: user.email,
              pass: user.pass
            }
          }).success(function(data) {
            data = data.data;
            $rootScope.accessToken = data.accessToken;
            $rootScope.loginData = {
              token: data.accessToken,
              expires: data.expires
            };
            return defer.resolve(data);
          }).error(function(e) {
            return defer.reject(e);
          });
          return defer.promise;
        },
        loggedIn: function() {
          return $rootScope.wd.oauthio !== void 0 && $rootScope.wd.oauthio.access_token !== void 0;
        },
        logout: function() {
          $rootScope.logged_user = void 0;
          $rootScope.accessToken = void 0;
          return $location.path('/login');
        }
      };
      return user_service;
    }
  ]);
};

},{"../utilities/apiCaller":24,"q":27}],24:[function(require,module,exports){
module.exports = function($http, $rootScope) {
  return function(url, success, error, opts) {
    var req;
    if (opts == null) {
      opts = {};
    }
    opts.url = "/api" + url;
    if (opts.data) {
      opts.data = JSON.stringify(opts.data);
      if (opts.method == null) {
        opts.method = "POST";
      }
    }
    opts.method = opts.method || "GET";
    if (opts.headers == null) {
      opts.headers = {};
    }
    if ($rootScope.accessToken) {
      opts.headers.Authorization = "Bearer " + $rootScope.accessToken;
    }
    if (opts.method === "POST" || opts.method === "PUT") {
      opts.headers['Content-Type'] = 'application/json';
    }
    req = $http(opts);
    if (success) {
      req.success(success);
    }
    if (error) {
      return req.error(error);
    }
  };
};

},{}],25:[function(require,module,exports){
(function (process,global){
/*!
 * async
 * https://github.com/caolan/async
 *
 * Copyright 2010-2014 Caolan McMahon
 * Released under the MIT license
 */
(function () {

    var async = {};
    function noop() {}
    function identity(v) {
        return v;
    }
    function toBool(v) {
        return !!v;
    }
    function notId(v) {
        return !v;
    }

    // global on the server, window in the browser
    var previous_async;

    // Establish the root object, `window` (`self`) in the browser, `global`
    // on the server, or `this` in some virtual machines. We use `self`
    // instead of `window` for `WebWorker` support.
    var root = typeof self === 'object' && self.self === self && self ||
            typeof global === 'object' && global.global === global && global ||
            this;

    if (root != null) {
        previous_async = root.async;
    }

    async.noConflict = function () {
        root.async = previous_async;
        return async;
    };

    function only_once(fn) {
        return function() {
            if (fn === null) throw new Error("Callback was already called.");
            fn.apply(this, arguments);
            fn = null;
        };
    }

    function _once(fn) {
        return function() {
            if (fn === null) return;
            fn.apply(this, arguments);
            fn = null;
        };
    }

    //// cross-browser compatiblity functions ////

    var _toString = Object.prototype.toString;

    var _isArray = Array.isArray || function (obj) {
        return _toString.call(obj) === '[object Array]';
    };

    // Ported from underscore.js isObject
    var _isObject = function(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };

    function _isArrayLike(arr) {
        return _isArray(arr) || (
            // has a positive integer length property
            typeof arr.length === "number" &&
            arr.length >= 0 &&
            arr.length % 1 === 0
        );
    }

    function _arrayEach(arr, iterator) {
        var index = -1,
            length = arr.length;

        while (++index < length) {
            iterator(arr[index], index, arr);
        }
    }

    function _map(arr, iterator) {
        var index = -1,
            length = arr.length,
            result = Array(length);

        while (++index < length) {
            result[index] = iterator(arr[index], index, arr);
        }
        return result;
    }

    function _range(count) {
        return _map(Array(count), function (v, i) { return i; });
    }

    function _reduce(arr, iterator, memo) {
        _arrayEach(arr, function (x, i, a) {
            memo = iterator(memo, x, i, a);
        });
        return memo;
    }

    function _forEachOf(object, iterator) {
        _arrayEach(_keys(object), function (key) {
            iterator(object[key], key);
        });
    }

    function _indexOf(arr, item) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === item) return i;
        }
        return -1;
    }

    var _keys = Object.keys || function (obj) {
        var keys = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    };

    function _keyIterator(coll) {
        var i = -1;
        var len;
        var keys;
        if (_isArrayLike(coll)) {
            len = coll.length;
            return function next() {
                i++;
                return i < len ? i : null;
            };
        } else {
            keys = _keys(coll);
            len = keys.length;
            return function next() {
                i++;
                return i < len ? keys[i] : null;
            };
        }
    }

    // Similar to ES6's rest param (http://ariya.ofilabs.com/2013/03/es6-and-rest-parameter.html)
    // This accumulates the arguments passed into an array, after a given index.
    // From underscore.js (https://github.com/jashkenas/underscore/pull/2140).
    function _restParam(func, startIndex) {
        startIndex = startIndex == null ? func.length - 1 : +startIndex;
        return function() {
            var length = Math.max(arguments.length - startIndex, 0);
            var rest = Array(length);
            for (var index = 0; index < length; index++) {
                rest[index] = arguments[index + startIndex];
            }
            switch (startIndex) {
                case 0: return func.call(this, rest);
                case 1: return func.call(this, arguments[0], rest);
            }
            // Currently unused but handle cases outside of the switch statement:
            // var args = Array(startIndex + 1);
            // for (index = 0; index < startIndex; index++) {
            //     args[index] = arguments[index];
            // }
            // args[startIndex] = rest;
            // return func.apply(this, args);
        };
    }

    function _withoutIndex(iterator) {
        return function (value, index, callback) {
            return iterator(value, callback);
        };
    }

    //// exported async module functions ////

    //// nextTick implementation with browser-compatible fallback ////

    // capture the global reference to guard against fakeTimer mocks
    var _setImmediate = typeof setImmediate === 'function' && setImmediate;

    var _delay = _setImmediate ? function(fn) {
        // not a direct alias for IE10 compatibility
        _setImmediate(fn);
    } : function(fn) {
        setTimeout(fn, 0);
    };

    if (typeof process === 'object' && typeof process.nextTick === 'function') {
        async.nextTick = process.nextTick;
    } else {
        async.nextTick = _delay;
    }
    async.setImmediate = _setImmediate ? _delay : async.nextTick;


    async.forEach =
    async.each = function (arr, iterator, callback) {
        return async.eachOf(arr, _withoutIndex(iterator), callback);
    };

    async.forEachSeries =
    async.eachSeries = function (arr, iterator, callback) {
        return async.eachOfSeries(arr, _withoutIndex(iterator), callback);
    };


    async.forEachLimit =
    async.eachLimit = function (arr, limit, iterator, callback) {
        return _eachOfLimit(limit)(arr, _withoutIndex(iterator), callback);
    };

    async.forEachOf =
    async.eachOf = function (object, iterator, callback) {
        callback = _once(callback || noop);
        object = object || [];

        var iter = _keyIterator(object);
        var key, completed = 0;

        while ((key = iter()) != null) {
            completed += 1;
            iterator(object[key], key, only_once(done));
        }

        if (completed === 0) callback(null);

        function done(err) {
            completed--;
            if (err) {
                callback(err);
            }
            // Check key is null in case iterator isn't exhausted
            // and done resolved synchronously.
            else if (key === null && completed <= 0) {
                callback(null);
            }
        }
    };

    async.forEachOfSeries =
    async.eachOfSeries = function (obj, iterator, callback) {
        callback = _once(callback || noop);
        obj = obj || [];
        var nextKey = _keyIterator(obj);
        var key = nextKey();
        function iterate() {
            var sync = true;
            if (key === null) {
                return callback(null);
            }
            iterator(obj[key], key, only_once(function (err) {
                if (err) {
                    callback(err);
                }
                else {
                    key = nextKey();
                    if (key === null) {
                        return callback(null);
                    } else {
                        if (sync) {
                            async.setImmediate(iterate);
                        } else {
                            iterate();
                        }
                    }
                }
            }));
            sync = false;
        }
        iterate();
    };



    async.forEachOfLimit =
    async.eachOfLimit = function (obj, limit, iterator, callback) {
        _eachOfLimit(limit)(obj, iterator, callback);
    };

    function _eachOfLimit(limit) {

        return function (obj, iterator, callback) {
            callback = _once(callback || noop);
            obj = obj || [];
            var nextKey = _keyIterator(obj);
            if (limit <= 0) {
                return callback(null);
            }
            var done = false;
            var running = 0;
            var errored = false;

            (function replenish () {
                if (done && running <= 0) {
                    return callback(null);
                }

                while (running < limit && !errored) {
                    var key = nextKey();
                    if (key === null) {
                        done = true;
                        if (running <= 0) {
                            callback(null);
                        }
                        return;
                    }
                    running += 1;
                    iterator(obj[key], key, only_once(function (err) {
                        running -= 1;
                        if (err) {
                            callback(err);
                            errored = true;
                        }
                        else {
                            replenish();
                        }
                    }));
                }
            })();
        };
    }


    function doParallel(fn) {
        return function (obj, iterator, callback) {
            return fn(async.eachOf, obj, iterator, callback);
        };
    }
    function doParallelLimit(fn) {
        return function (obj, limit, iterator, callback) {
            return fn(_eachOfLimit(limit), obj, iterator, callback);
        };
    }
    function doSeries(fn) {
        return function (obj, iterator, callback) {
            return fn(async.eachOfSeries, obj, iterator, callback);
        };
    }

    function _asyncMap(eachfn, arr, iterator, callback) {
        callback = _once(callback || noop);
        arr = arr || [];
        var results = _isArrayLike(arr) ? [] : {};
        eachfn(arr, function (value, index, callback) {
            iterator(value, function (err, v) {
                results[index] = v;
                callback(err);
            });
        }, function (err) {
            callback(err, results);
        });
    }

    async.map = doParallel(_asyncMap);
    async.mapSeries = doSeries(_asyncMap);
    async.mapLimit = doParallelLimit(_asyncMap);

    // reduce only has a series version, as doing reduce in parallel won't
    // work in many situations.
    async.inject =
    async.foldl =
    async.reduce = function (arr, memo, iterator, callback) {
        async.eachOfSeries(arr, function (x, i, callback) {
            iterator(memo, x, function (err, v) {
                memo = v;
                callback(err);
            });
        }, function (err) {
            callback(err, memo);
        });
    };

    async.foldr =
    async.reduceRight = function (arr, memo, iterator, callback) {
        var reversed = _map(arr, identity).reverse();
        async.reduce(reversed, memo, iterator, callback);
    };

    async.transform = function (arr, memo, iterator, callback) {
        if (arguments.length === 3) {
            callback = iterator;
            iterator = memo;
            memo = _isArray(arr) ? [] : {};
        }

        async.eachOf(arr, function(v, k, cb) {
            iterator(memo, v, k, cb);
        }, function(err) {
            callback(err, memo);
        });
    };

    function _filter(eachfn, arr, iterator, callback) {
        var results = [];
        eachfn(arr, function (x, index, callback) {
            iterator(x, function (v) {
                if (v) {
                    results.push({index: index, value: x});
                }
                callback();
            });
        }, function () {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    }

    async.select =
    async.filter = doParallel(_filter);

    async.selectLimit =
    async.filterLimit = doParallelLimit(_filter);

    async.selectSeries =
    async.filterSeries = doSeries(_filter);

    function _reject(eachfn, arr, iterator, callback) {
        _filter(eachfn, arr, function(value, cb) {
            iterator(value, function(v) {
                cb(!v);
            });
        }, callback);
    }
    async.reject = doParallel(_reject);
    async.rejectLimit = doParallelLimit(_reject);
    async.rejectSeries = doSeries(_reject);

    function _createTester(eachfn, check, getResult) {
        return function(arr, limit, iterator, cb) {
            function done() {
                if (cb) cb(getResult(false, void 0));
            }
            function iteratee(x, _, callback) {
                if (!cb) return callback();
                iterator(x, function (v) {
                    if (cb && check(v)) {
                        cb(getResult(true, x));
                        cb = iterator = false;
                    }
                    callback();
                });
            }
            if (arguments.length > 3) {
                eachfn(arr, limit, iteratee, done);
            } else {
                cb = iterator;
                iterator = limit;
                eachfn(arr, iteratee, done);
            }
        };
    }

    async.any =
    async.some = _createTester(async.eachOf, toBool, identity);

    async.someLimit = _createTester(async.eachOfLimit, toBool, identity);

    async.all =
    async.every = _createTester(async.eachOf, notId, notId);

    async.everyLimit = _createTester(async.eachOfLimit, notId, notId);

    function _findGetResult(v, x) {
        return x;
    }
    async.detect = _createTester(async.eachOf, identity, _findGetResult);
    async.detectSeries = _createTester(async.eachOfSeries, identity, _findGetResult);
    async.detectLimit = _createTester(async.eachOfLimit, identity, _findGetResult);

    async.sortBy = function (arr, iterator, callback) {
        async.map(arr, function (x, callback) {
            iterator(x, function (err, criteria) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, {value: x, criteria: criteria});
                }
            });
        }, function (err, results) {
            if (err) {
                return callback(err);
            }
            else {
                callback(null, _map(results.sort(comparator), function (x) {
                    return x.value;
                }));
            }

        });

        function comparator(left, right) {
            var a = left.criteria, b = right.criteria;
            return a < b ? -1 : a > b ? 1 : 0;
        }
    };

    async.auto = function (tasks, concurrency, callback) {
        if (typeof arguments[1] === 'function') {
            // concurrency is optional, shift the args.
            callback = concurrency;
            concurrency = null;
        }
        callback = _once(callback || noop);
        var keys = _keys(tasks);
        var remainingTasks = keys.length;
        if (!remainingTasks) {
            return callback(null);
        }
        if (!concurrency) {
            concurrency = remainingTasks;
        }

        var results = {};
        var runningTasks = 0;

        var hasError = false;

        var listeners = [];
        function addListener(fn) {
            listeners.unshift(fn);
        }
        function removeListener(fn) {
            var idx = _indexOf(listeners, fn);
            if (idx >= 0) listeners.splice(idx, 1);
        }
        function taskComplete() {
            remainingTasks--;
            _arrayEach(listeners.slice(0), function (fn) {
                fn();
            });
        }

        addListener(function () {
            if (!remainingTasks) {
                callback(null, results);
            }
        });

        _arrayEach(keys, function (k) {
            if (hasError) return;
            var task = _isArray(tasks[k]) ? tasks[k]: [tasks[k]];
            var taskCallback = _restParam(function(err, args) {
                runningTasks--;
                if (args.length <= 1) {
                    args = args[0];
                }
                if (err) {
                    var safeResults = {};
                    _forEachOf(results, function(val, rkey) {
                        safeResults[rkey] = val;
                    });
                    safeResults[k] = args;
                    hasError = true;

                    callback(err, safeResults);
                }
                else {
                    results[k] = args;
                    async.setImmediate(taskComplete);
                }
            });
            var requires = task.slice(0, task.length - 1);
            // prevent dead-locks
            var len = requires.length;
            var dep;
            while (len--) {
                if (!(dep = tasks[requires[len]])) {
                    throw new Error('Has nonexistent dependency in ' + requires.join(', '));
                }
                if (_isArray(dep) && _indexOf(dep, k) >= 0) {
                    throw new Error('Has cyclic dependencies');
                }
            }
            function ready() {
                return runningTasks < concurrency && _reduce(requires, function (a, x) {
                    return (a && results.hasOwnProperty(x));
                }, true) && !results.hasOwnProperty(k);
            }
            if (ready()) {
                runningTasks++;
                task[task.length - 1](taskCallback, results);
            }
            else {
                addListener(listener);
            }
            function listener() {
                if (ready()) {
                    runningTasks++;
                    removeListener(listener);
                    task[task.length - 1](taskCallback, results);
                }
            }
        });
    };



    async.retry = function(times, task, callback) {
        var DEFAULT_TIMES = 5;
        var DEFAULT_INTERVAL = 0;

        var attempts = [];

        var opts = {
            times: DEFAULT_TIMES,
            interval: DEFAULT_INTERVAL
        };

        function parseTimes(acc, t){
            if(typeof t === 'number'){
                acc.times = parseInt(t, 10) || DEFAULT_TIMES;
            } else if(typeof t === 'object'){
                acc.times = parseInt(t.times, 10) || DEFAULT_TIMES;
                acc.interval = parseInt(t.interval, 10) || DEFAULT_INTERVAL;
            } else {
                throw new Error('Unsupported argument type for \'times\': ' + typeof t);
            }
        }

        var length = arguments.length;
        if (length < 1 || length > 3) {
            throw new Error('Invalid arguments - must be either (task), (task, callback), (times, task) or (times, task, callback)');
        } else if (length <= 2 && typeof times === 'function') {
            callback = task;
            task = times;
        }
        if (typeof times !== 'function') {
            parseTimes(opts, times);
        }
        opts.callback = callback;
        opts.task = task;

        function wrappedTask(wrappedCallback, wrappedResults) {
            function retryAttempt(task, finalAttempt) {
                return function(seriesCallback) {
                    task(function(err, result){
                        seriesCallback(!err || finalAttempt, {err: err, result: result});
                    }, wrappedResults);
                };
            }

            function retryInterval(interval){
                return function(seriesCallback){
                    setTimeout(function(){
                        seriesCallback(null);
                    }, interval);
                };
            }

            while (opts.times) {

                var finalAttempt = !(opts.times-=1);
                attempts.push(retryAttempt(opts.task, finalAttempt));
                if(!finalAttempt && opts.interval > 0){
                    attempts.push(retryInterval(opts.interval));
                }
            }

            async.series(attempts, function(done, data){
                data = data[data.length - 1];
                (wrappedCallback || opts.callback)(data.err, data.result);
            });
        }

        // If a callback is passed, run this as a controll flow
        return opts.callback ? wrappedTask() : wrappedTask;
    };

    async.waterfall = function (tasks, callback) {
        callback = _once(callback || noop);
        if (!_isArray(tasks)) {
            var err = new Error('First argument to waterfall must be an array of functions');
            return callback(err);
        }
        if (!tasks.length) {
            return callback();
        }
        function wrapIterator(iterator) {
            return _restParam(function (err, args) {
                if (err) {
                    callback.apply(null, [err].concat(args));
                }
                else {
                    var next = iterator.next();
                    if (next) {
                        args.push(wrapIterator(next));
                    }
                    else {
                        args.push(callback);
                    }
                    ensureAsync(iterator).apply(null, args);
                }
            });
        }
        wrapIterator(async.iterator(tasks))();
    };

    function _parallel(eachfn, tasks, callback) {
        callback = callback || noop;
        var results = _isArrayLike(tasks) ? [] : {};

        eachfn(tasks, function (task, key, callback) {
            task(_restParam(function (err, args) {
                if (args.length <= 1) {
                    args = args[0];
                }
                results[key] = args;
                callback(err);
            }));
        }, function (err) {
            callback(err, results);
        });
    }

    async.parallel = function (tasks, callback) {
        _parallel(async.eachOf, tasks, callback);
    };

    async.parallelLimit = function(tasks, limit, callback) {
        _parallel(_eachOfLimit(limit), tasks, callback);
    };

    async.series = function(tasks, callback) {
        _parallel(async.eachOfSeries, tasks, callback);
    };

    async.iterator = function (tasks) {
        function makeCallback(index) {
            function fn() {
                if (tasks.length) {
                    tasks[index].apply(null, arguments);
                }
                return fn.next();
            }
            fn.next = function () {
                return (index < tasks.length - 1) ? makeCallback(index + 1): null;
            };
            return fn;
        }
        return makeCallback(0);
    };

    async.apply = _restParam(function (fn, args) {
        return _restParam(function (callArgs) {
            return fn.apply(
                null, args.concat(callArgs)
            );
        });
    });

    function _concat(eachfn, arr, fn, callback) {
        var result = [];
        eachfn(arr, function (x, index, cb) {
            fn(x, function (err, y) {
                result = result.concat(y || []);
                cb(err);
            });
        }, function (err) {
            callback(err, result);
        });
    }
    async.concat = doParallel(_concat);
    async.concatSeries = doSeries(_concat);

    async.whilst = function (test, iterator, callback) {
        callback = callback || noop;
        if (test()) {
            var next = _restParam(function(err, args) {
                if (err) {
                    callback(err);
                } else if (test.apply(this, args)) {
                    iterator(next);
                } else {
                    callback.apply(null, [null].concat(args));
                }
            });
            iterator(next);
        } else {
            callback(null);
        }
    };

    async.doWhilst = function (iterator, test, callback) {
        var calls = 0;
        return async.whilst(function() {
            return ++calls <= 1 || test.apply(this, arguments);
        }, iterator, callback);
    };

    async.until = function (test, iterator, callback) {
        return async.whilst(function() {
            return !test.apply(this, arguments);
        }, iterator, callback);
    };

    async.doUntil = function (iterator, test, callback) {
        return async.doWhilst(iterator, function() {
            return !test.apply(this, arguments);
        }, callback);
    };

    async.during = function (test, iterator, callback) {
        callback = callback || noop;

        var next = _restParam(function(err, args) {
            if (err) {
                callback(err);
            } else {
                args.push(check);
                test.apply(this, args);
            }
        });

        var check = function(err, truth) {
            if (err) {
                callback(err);
            } else if (truth) {
                iterator(next);
            } else {
                callback(null);
            }
        };

        test(check);
    };

    async.doDuring = function (iterator, test, callback) {
        var calls = 0;
        async.during(function(next) {
            if (calls++ < 1) {
                next(null, true);
            } else {
                test.apply(this, arguments);
            }
        }, iterator, callback);
    };

    function _queue(worker, concurrency, payload) {
        if (concurrency == null) {
            concurrency = 1;
        }
        else if(concurrency === 0) {
            throw new Error('Concurrency must not be zero');
        }
        function _insert(q, data, pos, callback) {
            if (callback != null && typeof callback !== "function") {
                throw new Error("task callback must be a function");
            }
            q.started = true;
            if (!_isArray(data)) {
                data = [data];
            }
            if(data.length === 0 && q.idle()) {
                // call drain immediately if there are no tasks
                return async.setImmediate(function() {
                    q.drain();
                });
            }
            _arrayEach(data, function(task) {
                var item = {
                    data: task,
                    callback: callback || noop
                };

                if (pos) {
                    q.tasks.unshift(item);
                } else {
                    q.tasks.push(item);
                }

                if (q.tasks.length === q.concurrency) {
                    q.saturated();
                }
            });
            async.setImmediate(q.process);
        }
        function _next(q, tasks) {
            return function(){
                workers -= 1;

                var removed = false;
                var args = arguments;
                _arrayEach(tasks, function (task) {
                    _arrayEach(workersList, function (worker, index) {
                        if (worker === task && !removed) {
                            workersList.splice(index, 1);
                            removed = true;
                        }
                    });

                    task.callback.apply(task, args);
                });
                if (q.tasks.length + workers === 0) {
                    q.drain();
                }
                q.process();
            };
        }

        var workers = 0;
        var workersList = [];
        var q = {
            tasks: [],
            concurrency: concurrency,
            payload: payload,
            saturated: noop,
            empty: noop,
            drain: noop,
            started: false,
            paused: false,
            push: function (data, callback) {
                _insert(q, data, false, callback);
            },
            kill: function () {
                q.drain = noop;
                q.tasks = [];
            },
            unshift: function (data, callback) {
                _insert(q, data, true, callback);
            },
            process: function () {
                while(!q.paused && workers < q.concurrency && q.tasks.length){

                    var tasks = q.payload ?
                        q.tasks.splice(0, q.payload) :
                        q.tasks.splice(0, q.tasks.length);

                    var data = _map(tasks, function (task) {
                        return task.data;
                    });

                    if (q.tasks.length === 0) {
                        q.empty();
                    }
                    workers += 1;
                    workersList.push(tasks[0]);
                    var cb = only_once(_next(q, tasks));
                    worker(data, cb);
                }
            },
            length: function () {
                return q.tasks.length;
            },
            running: function () {
                return workers;
            },
            workersList: function () {
                return workersList;
            },
            idle: function() {
                return q.tasks.length + workers === 0;
            },
            pause: function () {
                q.paused = true;
            },
            resume: function () {
                if (q.paused === false) { return; }
                q.paused = false;
                var resumeCount = Math.min(q.concurrency, q.tasks.length);
                // Need to call q.process once per concurrent
                // worker to preserve full concurrency after pause
                for (var w = 1; w <= resumeCount; w++) {
                    async.setImmediate(q.process);
                }
            }
        };
        return q;
    }

    async.queue = function (worker, concurrency) {
        var q = _queue(function (items, cb) {
            worker(items[0], cb);
        }, concurrency, 1);

        return q;
    };

    async.priorityQueue = function (worker, concurrency) {

        function _compareTasks(a, b){
            return a.priority - b.priority;
        }

        function _binarySearch(sequence, item, compare) {
            var beg = -1,
                end = sequence.length - 1;
            while (beg < end) {
                var mid = beg + ((end - beg + 1) >>> 1);
                if (compare(item, sequence[mid]) >= 0) {
                    beg = mid;
                } else {
                    end = mid - 1;
                }
            }
            return beg;
        }

        function _insert(q, data, priority, callback) {
            if (callback != null && typeof callback !== "function") {
                throw new Error("task callback must be a function");
            }
            q.started = true;
            if (!_isArray(data)) {
                data = [data];
            }
            if(data.length === 0) {
                // call drain immediately if there are no tasks
                return async.setImmediate(function() {
                    q.drain();
                });
            }
            _arrayEach(data, function(task) {
                var item = {
                    data: task,
                    priority: priority,
                    callback: typeof callback === 'function' ? callback : noop
                };

                q.tasks.splice(_binarySearch(q.tasks, item, _compareTasks) + 1, 0, item);

                if (q.tasks.length === q.concurrency) {
                    q.saturated();
                }
                async.setImmediate(q.process);
            });
        }

        // Start with a normal queue
        var q = async.queue(worker, concurrency);

        // Override push to accept second parameter representing priority
        q.push = function (data, priority, callback) {
            _insert(q, data, priority, callback);
        };

        // Remove unshift function
        delete q.unshift;

        return q;
    };

    async.cargo = function (worker, payload) {
        return _queue(worker, 1, payload);
    };

    function _console_fn(name) {
        return _restParam(function (fn, args) {
            fn.apply(null, args.concat([_restParam(function (err, args) {
                if (typeof console === 'object') {
                    if (err) {
                        if (console.error) {
                            console.error(err);
                        }
                    }
                    else if (console[name]) {
                        _arrayEach(args, function (x) {
                            console[name](x);
                        });
                    }
                }
            })]));
        });
    }
    async.log = _console_fn('log');
    async.dir = _console_fn('dir');
    /*async.info = _console_fn('info');
    async.warn = _console_fn('warn');
    async.error = _console_fn('error');*/

    async.memoize = function (fn, hasher) {
        var memo = {};
        var queues = {};
        var has = Object.prototype.hasOwnProperty;
        hasher = hasher || identity;
        var memoized = _restParam(function memoized(args) {
            var callback = args.pop();
            var key = hasher.apply(null, args);
            if (has.call(memo, key)) {   
                async.setImmediate(function () {
                    callback.apply(null, memo[key]);
                });
            }
            else if (has.call(queues, key)) {
                queues[key].push(callback);
            }
            else {
                queues[key] = [callback];
                fn.apply(null, args.concat([_restParam(function (args) {
                    memo[key] = args;
                    var q = queues[key];
                    delete queues[key];
                    for (var i = 0, l = q.length; i < l; i++) {
                        q[i].apply(null, args);
                    }
                })]));
            }
        });
        memoized.memo = memo;
        memoized.unmemoized = fn;
        return memoized;
    };

    async.unmemoize = function (fn) {
        return function () {
            return (fn.unmemoized || fn).apply(null, arguments);
        };
    };

    function _times(mapper) {
        return function (count, iterator, callback) {
            mapper(_range(count), iterator, callback);
        };
    }

    async.times = _times(async.map);
    async.timesSeries = _times(async.mapSeries);
    async.timesLimit = function (count, limit, iterator, callback) {
        return async.mapLimit(_range(count), limit, iterator, callback);
    };

    async.seq = function (/* functions... */) {
        var fns = arguments;
        return _restParam(function (args) {
            var that = this;

            var callback = args[args.length - 1];
            if (typeof callback == 'function') {
                args.pop();
            } else {
                callback = noop;
            }

            async.reduce(fns, args, function (newargs, fn, cb) {
                fn.apply(that, newargs.concat([_restParam(function (err, nextargs) {
                    cb(err, nextargs);
                })]));
            },
            function (err, results) {
                callback.apply(that, [err].concat(results));
            });
        });
    };

    async.compose = function (/* functions... */) {
        return async.seq.apply(null, Array.prototype.reverse.call(arguments));
    };


    function _applyEach(eachfn) {
        return _restParam(function(fns, args) {
            var go = _restParam(function(args) {
                var that = this;
                var callback = args.pop();
                return eachfn(fns, function (fn, _, cb) {
                    fn.apply(that, args.concat([cb]));
                },
                callback);
            });
            if (args.length) {
                return go.apply(this, args);
            }
            else {
                return go;
            }
        });
    }

    async.applyEach = _applyEach(async.eachOf);
    async.applyEachSeries = _applyEach(async.eachOfSeries);


    async.forever = function (fn, callback) {
        var done = only_once(callback || noop);
        var task = ensureAsync(fn);
        function next(err) {
            if (err) {
                return done(err);
            }
            task(next);
        }
        next();
    };

    function ensureAsync(fn) {
        return _restParam(function (args) {
            var callback = args.pop();
            args.push(function () {
                var innerArgs = arguments;
                if (sync) {
                    async.setImmediate(function () {
                        callback.apply(null, innerArgs);
                    });
                } else {
                    callback.apply(null, innerArgs);
                }
            });
            var sync = true;
            fn.apply(this, args);
            sync = false;
        });
    }

    async.ensureAsync = ensureAsync;

    async.constant = _restParam(function(values) {
        var args = [null].concat(values);
        return function (callback) {
            return callback.apply(this, args);
        };
    });

    async.wrapSync =
    async.asyncify = function asyncify(func) {
        return _restParam(function (args) {
            var callback = args.pop();
            var result;
            try {
                result = func.apply(this, args);
            } catch (e) {
                return callback(e);
            }
            // if result is Promise object
            if (_isObject(result) && typeof result.then === "function") {
                result.then(function(value) {
                    callback(null, value);
                })["catch"](function(err) {
                    callback(err.message ? err : new Error(err));
                });
            } else {
                callback(null, result);
            }
        });
    };

    // Node.js
    if (typeof module === 'object' && module.exports) {
        module.exports = async;
    }
    // AMD / RequireJS
    else if (typeof define === 'function' && define.amd) {
        define([], function () {
            return async;
        });
    }
    // included directly via <script> tag
    else {
        root.async = async;
    }

}());

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":26}],26:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],27:[function(require,module,exports){
(function (process){
// vim:ts=4:sts=4:sw=4:
/*!
 *
 * Copyright 2009-2012 Kris Kowal under the terms of the MIT
 * license found at http://github.com/kriskowal/q/raw/master/LICENSE
 *
 * With parts by Tyler Close
 * Copyright 2007-2009 Tyler Close under the terms of the MIT X license found
 * at http://www.opensource.org/licenses/mit-license.html
 * Forked at ref_send.js version: 2009-05-11
 *
 * With parts by Mark Miller
 * Copyright (C) 2011 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

(function (definition) {
    "use strict";

    // This file will function properly as a <script> tag, or a module
    // using CommonJS and NodeJS or RequireJS module formats.  In
    // Common/Node/RequireJS, the module exports the Q API and when
    // executed as a simple <script>, it creates a Q global instead.

    // Montage Require
    if (typeof bootstrap === "function") {
        bootstrap("promise", definition);

    // CommonJS
    } else if (typeof exports === "object" && typeof module === "object") {
        module.exports = definition();

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
        define(definition);

    // SES (Secure EcmaScript)
    } else if (typeof ses !== "undefined") {
        if (!ses.ok()) {
            return;
        } else {
            ses.makeQ = definition;
        }

    // <script>
    } else if (typeof window !== "undefined" || typeof self !== "undefined") {
        // Prefer window over self for add-on scripts. Use self for
        // non-windowed contexts.
        var global = typeof window !== "undefined" ? window : self;

        // Get the `window` object, save the previous Q global
        // and initialize Q as a global.
        var previousQ = global.Q;
        global.Q = definition();

        // Add a noConflict function so Q can be removed from the
        // global namespace.
        global.Q.noConflict = function () {
            global.Q = previousQ;
            return this;
        };

    } else {
        throw new Error("This environment was not anticipated by Q. Please file a bug.");
    }

})(function () {
"use strict";

var hasStacks = false;
try {
    throw new Error();
} catch (e) {
    hasStacks = !!e.stack;
}

// All code after this point will be filtered from stack traces reported
// by Q.
var qStartingLine = captureLine();
var qFileName;

// shims

// used for fallback in "allResolved"
var noop = function () {};

// Use the fastest possible means to execute a task in a future turn
// of the event loop.
var nextTick =(function () {
    // linked list of tasks (single, with head node)
    var head = {task: void 0, next: null};
    var tail = head;
    var flushing = false;
    var requestTick = void 0;
    var isNodeJS = false;
    // queue for late tasks, used by unhandled rejection tracking
    var laterQueue = [];

    function flush() {
        /* jshint loopfunc: true */
        var task, domain;

        while (head.next) {
            head = head.next;
            task = head.task;
            head.task = void 0;
            domain = head.domain;

            if (domain) {
                head.domain = void 0;
                domain.enter();
            }
            runSingle(task, domain);

        }
        while (laterQueue.length) {
            task = laterQueue.pop();
            runSingle(task);
        }
        flushing = false;
    }
    // runs a single function in the async queue
    function runSingle(task, domain) {
        try {
            task();

        } catch (e) {
            if (isNodeJS) {
                // In node, uncaught exceptions are considered fatal errors.
                // Re-throw them synchronously to interrupt flushing!

                // Ensure continuation if the uncaught exception is suppressed
                // listening "uncaughtException" events (as domains does).
                // Continue in next event to avoid tick recursion.
                if (domain) {
                    domain.exit();
                }
                setTimeout(flush, 0);
                if (domain) {
                    domain.enter();
                }

                throw e;

            } else {
                // In browsers, uncaught exceptions are not fatal.
                // Re-throw them asynchronously to avoid slow-downs.
                setTimeout(function () {
                    throw e;
                }, 0);
            }
        }

        if (domain) {
            domain.exit();
        }
    }

    nextTick = function (task) {
        tail = tail.next = {
            task: task,
            domain: isNodeJS && process.domain,
            next: null
        };

        if (!flushing) {
            flushing = true;
            requestTick();
        }
    };

    if (typeof process === "object" &&
        process.toString() === "[object process]" && process.nextTick) {
        // Ensure Q is in a real Node environment, with a `process.nextTick`.
        // To see through fake Node environments:
        // * Mocha test runner - exposes a `process` global without a `nextTick`
        // * Browserify - exposes a `process.nexTick` function that uses
        //   `setTimeout`. In this case `setImmediate` is preferred because
        //    it is faster. Browserify's `process.toString()` yields
        //   "[object Object]", while in a real Node environment
        //   `process.nextTick()` yields "[object process]".
        isNodeJS = true;

        requestTick = function () {
            process.nextTick(flush);
        };

    } else if (typeof setImmediate === "function") {
        // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
        if (typeof window !== "undefined") {
            requestTick = setImmediate.bind(window, flush);
        } else {
            requestTick = function () {
                setImmediate(flush);
            };
        }

    } else if (typeof MessageChannel !== "undefined") {
        // modern browsers
        // http://www.nonblocking.io/2011/06/windownexttick.html
        var channel = new MessageChannel();
        // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create
        // working message ports the first time a page loads.
        channel.port1.onmessage = function () {
            requestTick = requestPortTick;
            channel.port1.onmessage = flush;
            flush();
        };
        var requestPortTick = function () {
            // Opera requires us to provide a message payload, regardless of
            // whether we use it.
            channel.port2.postMessage(0);
        };
        requestTick = function () {
            setTimeout(flush, 0);
            requestPortTick();
        };

    } else {
        // old browsers
        requestTick = function () {
            setTimeout(flush, 0);
        };
    }
    // runs a task after all other tasks have been run
    // this is useful for unhandled rejection tracking that needs to happen
    // after all `then`d tasks have been run.
    nextTick.runAfter = function (task) {
        laterQueue.push(task);
        if (!flushing) {
            flushing = true;
            requestTick();
        }
    };
    return nextTick;
})();

// Attempt to make generics safe in the face of downstream
// modifications.
// There is no situation where this is necessary.
// If you need a security guarantee, these primordials need to be
// deeply frozen anyway, and if you don’t need a security guarantee,
// this is just plain paranoid.
// However, this **might** have the nice side-effect of reducing the size of
// the minified code by reducing x.call() to merely x()
// See Mark Miller’s explanation of what this does.
// http://wiki.ecmascript.org/doku.php?id=conventions:safe_meta_programming
var call = Function.call;
function uncurryThis(f) {
    return function () {
        return call.apply(f, arguments);
    };
}
// This is equivalent, but slower:
// uncurryThis = Function_bind.bind(Function_bind.call);
// http://jsperf.com/uncurrythis

var array_slice = uncurryThis(Array.prototype.slice);

var array_reduce = uncurryThis(
    Array.prototype.reduce || function (callback, basis) {
        var index = 0,
            length = this.length;
        // concerning the initial value, if one is not provided
        if (arguments.length === 1) {
            // seek to the first value in the array, accounting
            // for the possibility that is is a sparse array
            do {
                if (index in this) {
                    basis = this[index++];
                    break;
                }
                if (++index >= length) {
                    throw new TypeError();
                }
            } while (1);
        }
        // reduce
        for (; index < length; index++) {
            // account for the possibility that the array is sparse
            if (index in this) {
                basis = callback(basis, this[index], index);
            }
        }
        return basis;
    }
);

var array_indexOf = uncurryThis(
    Array.prototype.indexOf || function (value) {
        // not a very good shim, but good enough for our one use of it
        for (var i = 0; i < this.length; i++) {
            if (this[i] === value) {
                return i;
            }
        }
        return -1;
    }
);

var array_map = uncurryThis(
    Array.prototype.map || function (callback, thisp) {
        var self = this;
        var collect = [];
        array_reduce(self, function (undefined, value, index) {
            collect.push(callback.call(thisp, value, index, self));
        }, void 0);
        return collect;
    }
);

var object_create = Object.create || function (prototype) {
    function Type() { }
    Type.prototype = prototype;
    return new Type();
};

var object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);

var object_keys = Object.keys || function (object) {
    var keys = [];
    for (var key in object) {
        if (object_hasOwnProperty(object, key)) {
            keys.push(key);
        }
    }
    return keys;
};

var object_toString = uncurryThis(Object.prototype.toString);

function isObject(value) {
    return value === Object(value);
}

// generator related shims

// FIXME: Remove this function once ES6 generators are in SpiderMonkey.
function isStopIteration(exception) {
    return (
        object_toString(exception) === "[object StopIteration]" ||
        exception instanceof QReturnValue
    );
}

// FIXME: Remove this helper and Q.return once ES6 generators are in
// SpiderMonkey.
var QReturnValue;
if (typeof ReturnValue !== "undefined") {
    QReturnValue = ReturnValue;
} else {
    QReturnValue = function (value) {
        this.value = value;
    };
}

// long stack traces

var STACK_JUMP_SEPARATOR = "From previous event:";

function makeStackTraceLong(error, promise) {
    // If possible, transform the error stack trace by removing Node and Q
    // cruft, then concatenating with the stack trace of `promise`. See #57.
    if (hasStacks &&
        promise.stack &&
        typeof error === "object" &&
        error !== null &&
        error.stack &&
        error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1
    ) {
        var stacks = [];
        for (var p = promise; !!p; p = p.source) {
            if (p.stack) {
                stacks.unshift(p.stack);
            }
        }
        stacks.unshift(error.stack);

        var concatedStacks = stacks.join("\n" + STACK_JUMP_SEPARATOR + "\n");
        error.stack = filterStackString(concatedStacks);
    }
}

function filterStackString(stackString) {
    var lines = stackString.split("\n");
    var desiredLines = [];
    for (var i = 0; i < lines.length; ++i) {
        var line = lines[i];

        if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
            desiredLines.push(line);
        }
    }
    return desiredLines.join("\n");
}

function isNodeFrame(stackLine) {
    return stackLine.indexOf("(module.js:") !== -1 ||
           stackLine.indexOf("(node.js:") !== -1;
}

function getFileNameAndLineNumber(stackLine) {
    // Named functions: "at functionName (filename:lineNumber:columnNumber)"
    // In IE10 function name can have spaces ("Anonymous function") O_o
    var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
    if (attempt1) {
        return [attempt1[1], Number(attempt1[2])];
    }

    // Anonymous functions: "at filename:lineNumber:columnNumber"
    var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
    if (attempt2) {
        return [attempt2[1], Number(attempt2[2])];
    }

    // Firefox style: "function@filename:lineNumber or @filename:lineNumber"
    var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
    if (attempt3) {
        return [attempt3[1], Number(attempt3[2])];
    }
}

function isInternalFrame(stackLine) {
    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);

    if (!fileNameAndLineNumber) {
        return false;
    }

    var fileName = fileNameAndLineNumber[0];
    var lineNumber = fileNameAndLineNumber[1];

    return fileName === qFileName &&
        lineNumber >= qStartingLine &&
        lineNumber <= qEndingLine;
}

// discover own file name and line number range for filtering stack
// traces
function captureLine() {
    if (!hasStacks) {
        return;
    }

    try {
        throw new Error();
    } catch (e) {
        var lines = e.stack.split("\n");
        var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
        var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
        if (!fileNameAndLineNumber) {
            return;
        }

        qFileName = fileNameAndLineNumber[0];
        return fileNameAndLineNumber[1];
    }
}

function deprecate(callback, name, alternative) {
    return function () {
        if (typeof console !== "undefined" &&
            typeof console.warn === "function") {
            console.warn(name + " is deprecated, use " + alternative +
                         " instead.", new Error("").stack);
        }
        return callback.apply(callback, arguments);
    };
}

// end of shims
// beginning of real work

/**
 * Constructs a promise for an immediate reference, passes promises through, or
 * coerces promises from different systems.
 * @param value immediate reference or promise
 */
function Q(value) {
    // If the object is already a Promise, return it directly.  This enables
    // the resolve function to both be used to created references from objects,
    // but to tolerably coerce non-promises to promises.
    if (value instanceof Promise) {
        return value;
    }

    // assimilate thenables
    if (isPromiseAlike(value)) {
        return coerce(value);
    } else {
        return fulfill(value);
    }
}
Q.resolve = Q;

/**
 * Performs a task in a future turn of the event loop.
 * @param {Function} task
 */
Q.nextTick = nextTick;

/**
 * Controls whether or not long stack traces will be on
 */
Q.longStackSupport = false;

// enable long stacks if Q_DEBUG is set
if (typeof process === "object" && process && process.env && process.env.Q_DEBUG) {
    Q.longStackSupport = true;
}

/**
 * Constructs a {promise, resolve, reject} object.
 *
 * `resolve` is a callback to invoke with a more resolved value for the
 * promise. To fulfill the promise, invoke `resolve` with any value that is
 * not a thenable. To reject the promise, invoke `resolve` with a rejected
 * thenable, or invoke `reject` with the reason directly. To resolve the
 * promise to another thenable, thus putting it in the same state, invoke
 * `resolve` with that other thenable.
 */
Q.defer = defer;
function defer() {
    // if "messages" is an "Array", that indicates that the promise has not yet
    // been resolved.  If it is "undefined", it has been resolved.  Each
    // element of the messages array is itself an array of complete arguments to
    // forward to the resolved promise.  We coerce the resolution value to a
    // promise using the `resolve` function because it handles both fully
    // non-thenable values and other thenables gracefully.
    var messages = [], progressListeners = [], resolvedPromise;

    var deferred = object_create(defer.prototype);
    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, operands) {
        var args = array_slice(arguments);
        if (messages) {
            messages.push(args);
            if (op === "when" && operands[1]) { // progress operand
                progressListeners.push(operands[1]);
            }
        } else {
            Q.nextTick(function () {
                resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
            });
        }
    };

    // XXX deprecated
    promise.valueOf = function () {
        if (messages) {
            return promise;
        }
        var nearerValue = nearer(resolvedPromise);
        if (isPromise(nearerValue)) {
            resolvedPromise = nearerValue; // shorten chain
        }
        return nearerValue;
    };

    promise.inspect = function () {
        if (!resolvedPromise) {
            return { state: "pending" };
        }
        return resolvedPromise.inspect();
    };

    if (Q.longStackSupport && hasStacks) {
        try {
            throw new Error();
        } catch (e) {
            // NOTE: don't try to use `Error.captureStackTrace` or transfer the
            // accessor around; that causes memory leaks as per GH-111. Just
            // reify the stack trace as a string ASAP.
            //
            // At the same time, cut off the first line; it's always just
            // "[object Promise]\n", as per the `toString`.
            promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1);
        }
    }

    // NOTE: we do the checks for `resolvedPromise` in each method, instead of
    // consolidating them into `become`, since otherwise we'd create new
    // promises with the lines `become(whatever(value))`. See e.g. GH-252.

    function become(newPromise) {
        resolvedPromise = newPromise;
        promise.source = newPromise;

        array_reduce(messages, function (undefined, message) {
            Q.nextTick(function () {
                newPromise.promiseDispatch.apply(newPromise, message);
            });
        }, void 0);

        messages = void 0;
        progressListeners = void 0;
    }

    deferred.promise = promise;
    deferred.resolve = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(Q(value));
    };

    deferred.fulfill = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(fulfill(value));
    };
    deferred.reject = function (reason) {
        if (resolvedPromise) {
            return;
        }

        become(reject(reason));
    };
    deferred.notify = function (progress) {
        if (resolvedPromise) {
            return;
        }

        array_reduce(progressListeners, function (undefined, progressListener) {
            Q.nextTick(function () {
                progressListener(progress);
            });
        }, void 0);
    };

    return deferred;
}

/**
 * Creates a Node-style callback that will resolve or reject the deferred
 * promise.
 * @returns a nodeback
 */
defer.prototype.makeNodeResolver = function () {
    var self = this;
    return function (error, value) {
        if (error) {
            self.reject(error);
        } else if (arguments.length > 2) {
            self.resolve(array_slice(arguments, 1));
        } else {
            self.resolve(value);
        }
    };
};

/**
 * @param resolver {Function} a function that returns nothing and accepts
 * the resolve, reject, and notify functions for a deferred.
 * @returns a promise that may be resolved with the given resolve and reject
 * functions, or rejected by a thrown exception in resolver
 */
Q.Promise = promise; // ES6
Q.promise = promise;
function promise(resolver) {
    if (typeof resolver !== "function") {
        throw new TypeError("resolver must be a function.");
    }
    var deferred = defer();
    try {
        resolver(deferred.resolve, deferred.reject, deferred.notify);
    } catch (reason) {
        deferred.reject(reason);
    }
    return deferred.promise;
}

promise.race = race; // ES6
promise.all = all; // ES6
promise.reject = reject; // ES6
promise.resolve = Q; // ES6

// XXX experimental.  This method is a way to denote that a local value is
// serializable and should be immediately dispatched to a remote upon request,
// instead of passing a reference.
Q.passByCopy = function (object) {
    //freeze(object);
    //passByCopies.set(object, true);
    return object;
};

Promise.prototype.passByCopy = function () {
    //freeze(object);
    //passByCopies.set(object, true);
    return this;
};

/**
 * If two promises eventually fulfill to the same value, promises that value,
 * but otherwise rejects.
 * @param x {Any*}
 * @param y {Any*}
 * @returns {Any*} a promise for x and y if they are the same, but a rejection
 * otherwise.
 *
 */
Q.join = function (x, y) {
    return Q(x).join(y);
};

Promise.prototype.join = function (that) {
    return Q([this, that]).spread(function (x, y) {
        if (x === y) {
            // TODO: "===" should be Object.is or equiv
            return x;
        } else {
            throw new Error("Can't join: not the same: " + x + " " + y);
        }
    });
};

/**
 * Returns a promise for the first of an array of promises to become settled.
 * @param answers {Array[Any*]} promises to race
 * @returns {Any*} the first promise to be settled
 */
Q.race = race;
function race(answerPs) {
    return promise(function (resolve, reject) {
        // Switch to this once we can assume at least ES5
        // answerPs.forEach(function (answerP) {
        //     Q(answerP).then(resolve, reject);
        // });
        // Use this in the meantime
        for (var i = 0, len = answerPs.length; i < len; i++) {
            Q(answerPs[i]).then(resolve, reject);
        }
    });
}

Promise.prototype.race = function () {
    return this.then(Q.race);
};

/**
 * Constructs a Promise with a promise descriptor object and optional fallback
 * function.  The descriptor contains methods like when(rejected), get(name),
 * set(name, value), post(name, args), and delete(name), which all
 * return either a value, a promise for a value, or a rejection.  The fallback
 * accepts the operation name, a resolver, and any further arguments that would
 * have been forwarded to the appropriate method above had a method been
 * provided with the proper name.  The API makes no guarantees about the nature
 * of the returned object, apart from that it is usable whereever promises are
 * bought and sold.
 */
Q.makePromise = Promise;
function Promise(descriptor, fallback, inspect) {
    if (fallback === void 0) {
        fallback = function (op) {
            return reject(new Error(
                "Promise does not support operation: " + op
            ));
        };
    }
    if (inspect === void 0) {
        inspect = function () {
            return {state: "unknown"};
        };
    }

    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, args) {
        var result;
        try {
            if (descriptor[op]) {
                result = descriptor[op].apply(promise, args);
            } else {
                result = fallback.call(promise, op, args);
            }
        } catch (exception) {
            result = reject(exception);
        }
        if (resolve) {
            resolve(result);
        }
    };

    promise.inspect = inspect;

    // XXX deprecated `valueOf` and `exception` support
    if (inspect) {
        var inspected = inspect();
        if (inspected.state === "rejected") {
            promise.exception = inspected.reason;
        }

        promise.valueOf = function () {
            var inspected = inspect();
            if (inspected.state === "pending" ||
                inspected.state === "rejected") {
                return promise;
            }
            return inspected.value;
        };
    }

    return promise;
}

Promise.prototype.toString = function () {
    return "[object Promise]";
};

Promise.prototype.then = function (fulfilled, rejected, progressed) {
    var self = this;
    var deferred = defer();
    var done = false;   // ensure the untrusted promise makes at most a
                        // single call to one of the callbacks

    function _fulfilled(value) {
        try {
            return typeof fulfilled === "function" ? fulfilled(value) : value;
        } catch (exception) {
            return reject(exception);
        }
    }

    function _rejected(exception) {
        if (typeof rejected === "function") {
            makeStackTraceLong(exception, self);
            try {
                return rejected(exception);
            } catch (newException) {
                return reject(newException);
            }
        }
        return reject(exception);
    }

    function _progressed(value) {
        return typeof progressed === "function" ? progressed(value) : value;
    }

    Q.nextTick(function () {
        self.promiseDispatch(function (value) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_fulfilled(value));
        }, "when", [function (exception) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_rejected(exception));
        }]);
    });

    // Progress propagator need to be attached in the current tick.
    self.promiseDispatch(void 0, "when", [void 0, function (value) {
        var newValue;
        var threw = false;
        try {
            newValue = _progressed(value);
        } catch (e) {
            threw = true;
            if (Q.onerror) {
                Q.onerror(e);
            } else {
                throw e;
            }
        }

        if (!threw) {
            deferred.notify(newValue);
        }
    }]);

    return deferred.promise;
};

Q.tap = function (promise, callback) {
    return Q(promise).tap(callback);
};

/**
 * Works almost like "finally", but not called for rejections.
 * Original resolution value is passed through callback unaffected.
 * Callback may return a promise that will be awaited for.
 * @param {Function} callback
 * @returns {Q.Promise}
 * @example
 * doSomething()
 *   .then(...)
 *   .tap(console.log)
 *   .then(...);
 */
Promise.prototype.tap = function (callback) {
    callback = Q(callback);

    return this.then(function (value) {
        return callback.fcall(value).thenResolve(value);
    });
};

/**
 * Registers an observer on a promise.
 *
 * Guarantees:
 *
 * 1. that fulfilled and rejected will be called only once.
 * 2. that either the fulfilled callback or the rejected callback will be
 *    called, but not both.
 * 3. that fulfilled and rejected will not be called in this turn.
 *
 * @param value      promise or immediate reference to observe
 * @param fulfilled  function to be called with the fulfilled value
 * @param rejected   function to be called with the rejection exception
 * @param progressed function to be called on any progress notifications
 * @return promise for the return value from the invoked callback
 */
Q.when = when;
function when(value, fulfilled, rejected, progressed) {
    return Q(value).then(fulfilled, rejected, progressed);
}

Promise.prototype.thenResolve = function (value) {
    return this.then(function () { return value; });
};

Q.thenResolve = function (promise, value) {
    return Q(promise).thenResolve(value);
};

Promise.prototype.thenReject = function (reason) {
    return this.then(function () { throw reason; });
};

Q.thenReject = function (promise, reason) {
    return Q(promise).thenReject(reason);
};

/**
 * If an object is not a promise, it is as "near" as possible.
 * If a promise is rejected, it is as "near" as possible too.
 * If it’s a fulfilled promise, the fulfillment value is nearer.
 * If it’s a deferred promise and the deferred has been resolved, the
 * resolution is "nearer".
 * @param object
 * @returns most resolved (nearest) form of the object
 */

// XXX should we re-do this?
Q.nearer = nearer;
function nearer(value) {
    if (isPromise(value)) {
        var inspected = value.inspect();
        if (inspected.state === "fulfilled") {
            return inspected.value;
        }
    }
    return value;
}

/**
 * @returns whether the given object is a promise.
 * Otherwise it is a fulfilled value.
 */
Q.isPromise = isPromise;
function isPromise(object) {
    return object instanceof Promise;
}

Q.isPromiseAlike = isPromiseAlike;
function isPromiseAlike(object) {
    return isObject(object) && typeof object.then === "function";
}

/**
 * @returns whether the given object is a pending promise, meaning not
 * fulfilled or rejected.
 */
Q.isPending = isPending;
function isPending(object) {
    return isPromise(object) && object.inspect().state === "pending";
}

Promise.prototype.isPending = function () {
    return this.inspect().state === "pending";
};

/**
 * @returns whether the given object is a value or fulfilled
 * promise.
 */
Q.isFulfilled = isFulfilled;
function isFulfilled(object) {
    return !isPromise(object) || object.inspect().state === "fulfilled";
}

Promise.prototype.isFulfilled = function () {
    return this.inspect().state === "fulfilled";
};

/**
 * @returns whether the given object is a rejected promise.
 */
Q.isRejected = isRejected;
function isRejected(object) {
    return isPromise(object) && object.inspect().state === "rejected";
}

Promise.prototype.isRejected = function () {
    return this.inspect().state === "rejected";
};

//// BEGIN UNHANDLED REJECTION TRACKING

// This promise library consumes exceptions thrown in handlers so they can be
// handled by a subsequent promise.  The exceptions get added to this array when
// they are created, and removed when they are handled.  Note that in ES6 or
// shimmed environments, this would naturally be a `Set`.
var unhandledReasons = [];
var unhandledRejections = [];
var reportedUnhandledRejections = [];
var trackUnhandledRejections = true;

function resetUnhandledRejections() {
    unhandledReasons.length = 0;
    unhandledRejections.length = 0;

    if (!trackUnhandledRejections) {
        trackUnhandledRejections = true;
    }
}

function trackRejection(promise, reason) {
    if (!trackUnhandledRejections) {
        return;
    }
    if (typeof process === "object" && typeof process.emit === "function") {
        Q.nextTick.runAfter(function () {
            if (array_indexOf(unhandledRejections, promise) !== -1) {
                process.emit("unhandledRejection", reason, promise);
                reportedUnhandledRejections.push(promise);
            }
        });
    }

    unhandledRejections.push(promise);
    if (reason && typeof reason.stack !== "undefined") {
        unhandledReasons.push(reason.stack);
    } else {
        unhandledReasons.push("(no stack) " + reason);
    }
}

function untrackRejection(promise) {
    if (!trackUnhandledRejections) {
        return;
    }

    var at = array_indexOf(unhandledRejections, promise);
    if (at !== -1) {
        if (typeof process === "object" && typeof process.emit === "function") {
            Q.nextTick.runAfter(function () {
                var atReport = array_indexOf(reportedUnhandledRejections, promise);
                if (atReport !== -1) {
                    process.emit("rejectionHandled", unhandledReasons[at], promise);
                    reportedUnhandledRejections.splice(atReport, 1);
                }
            });
        }
        unhandledRejections.splice(at, 1);
        unhandledReasons.splice(at, 1);
    }
}

Q.resetUnhandledRejections = resetUnhandledRejections;

Q.getUnhandledReasons = function () {
    // Make a copy so that consumers can't interfere with our internal state.
    return unhandledReasons.slice();
};

Q.stopUnhandledRejectionTracking = function () {
    resetUnhandledRejections();
    trackUnhandledRejections = false;
};

resetUnhandledRejections();

//// END UNHANDLED REJECTION TRACKING

/**
 * Constructs a rejected promise.
 * @param reason value describing the failure
 */
Q.reject = reject;
function reject(reason) {
    var rejection = Promise({
        "when": function (rejected) {
            // note that the error has been handled
            if (rejected) {
                untrackRejection(this);
            }
            return rejected ? rejected(reason) : this;
        }
    }, function fallback() {
        return this;
    }, function inspect() {
        return { state: "rejected", reason: reason };
    });

    // Note that the reason has not been handled.
    trackRejection(rejection, reason);

    return rejection;
}

/**
 * Constructs a fulfilled promise for an immediate reference.
 * @param value immediate reference
 */
Q.fulfill = fulfill;
function fulfill(value) {
    return Promise({
        "when": function () {
            return value;
        },
        "get": function (name) {
            return value[name];
        },
        "set": function (name, rhs) {
            value[name] = rhs;
        },
        "delete": function (name) {
            delete value[name];
        },
        "post": function (name, args) {
            // Mark Miller proposes that post with no name should apply a
            // promised function.
            if (name === null || name === void 0) {
                return value.apply(void 0, args);
            } else {
                return value[name].apply(value, args);
            }
        },
        "apply": function (thisp, args) {
            return value.apply(thisp, args);
        },
        "keys": function () {
            return object_keys(value);
        }
    }, void 0, function inspect() {
        return { state: "fulfilled", value: value };
    });
}

/**
 * Converts thenables to Q promises.
 * @param promise thenable promise
 * @returns a Q promise
 */
function coerce(promise) {
    var deferred = defer();
    Q.nextTick(function () {
        try {
            promise.then(deferred.resolve, deferred.reject, deferred.notify);
        } catch (exception) {
            deferred.reject(exception);
        }
    });
    return deferred.promise;
}

/**
 * Annotates an object such that it will never be
 * transferred away from this process over any promise
 * communication channel.
 * @param object
 * @returns promise a wrapping of that object that
 * additionally responds to the "isDef" message
 * without a rejection.
 */
Q.master = master;
function master(object) {
    return Promise({
        "isDef": function () {}
    }, function fallback(op, args) {
        return dispatch(object, op, args);
    }, function () {
        return Q(object).inspect();
    });
}

/**
 * Spreads the values of a promised array of arguments into the
 * fulfillment callback.
 * @param fulfilled callback that receives variadic arguments from the
 * promised array
 * @param rejected callback that receives the exception if the promise
 * is rejected.
 * @returns a promise for the return value or thrown exception of
 * either callback.
 */
Q.spread = spread;
function spread(value, fulfilled, rejected) {
    return Q(value).spread(fulfilled, rejected);
}

Promise.prototype.spread = function (fulfilled, rejected) {
    return this.all().then(function (array) {
        return fulfilled.apply(void 0, array);
    }, rejected);
};

/**
 * The async function is a decorator for generator functions, turning
 * them into asynchronous generators.  Although generators are only part
 * of the newest ECMAScript 6 drafts, this code does not cause syntax
 * errors in older engines.  This code should continue to work and will
 * in fact improve over time as the language improves.
 *
 * ES6 generators are currently part of V8 version 3.19 with the
 * --harmony-generators runtime flag enabled.  SpiderMonkey has had them
 * for longer, but under an older Python-inspired form.  This function
 * works on both kinds of generators.
 *
 * Decorates a generator function such that:
 *  - it may yield promises
 *  - execution will continue when that promise is fulfilled
 *  - the value of the yield expression will be the fulfilled value
 *  - it returns a promise for the return value (when the generator
 *    stops iterating)
 *  - the decorated function returns a promise for the return value
 *    of the generator or the first rejected promise among those
 *    yielded.
 *  - if an error is thrown in the generator, it propagates through
 *    every following yield until it is caught, or until it escapes
 *    the generator function altogether, and is translated into a
 *    rejection for the promise returned by the decorated generator.
 */
Q.async = async;
function async(makeGenerator) {
    return function () {
        // when verb is "send", arg is a value
        // when verb is "throw", arg is an exception
        function continuer(verb, arg) {
            var result;

            // Until V8 3.19 / Chromium 29 is released, SpiderMonkey is the only
            // engine that has a deployed base of browsers that support generators.
            // However, SM's generators use the Python-inspired semantics of
            // outdated ES6 drafts.  We would like to support ES6, but we'd also
            // like to make it possible to use generators in deployed browsers, so
            // we also support Python-style generators.  At some point we can remove
            // this block.

            if (typeof StopIteration === "undefined") {
                // ES6 Generators
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    return reject(exception);
                }
                if (result.done) {
                    return Q(result.value);
                } else {
                    return when(result.value, callback, errback);
                }
            } else {
                // SpiderMonkey Generators
                // FIXME: Remove this case when SM does ES6 generators.
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    if (isStopIteration(exception)) {
                        return Q(exception.value);
                    } else {
                        return reject(exception);
                    }
                }
                return when(result, callback, errback);
            }
        }
        var generator = makeGenerator.apply(this, arguments);
        var callback = continuer.bind(continuer, "next");
        var errback = continuer.bind(continuer, "throw");
        return callback();
    };
}

/**
 * The spawn function is a small wrapper around async that immediately
 * calls the generator and also ends the promise chain, so that any
 * unhandled errors are thrown instead of forwarded to the error
 * handler. This is useful because it's extremely common to run
 * generators at the top-level to work with libraries.
 */
Q.spawn = spawn;
function spawn(makeGenerator) {
    Q.done(Q.async(makeGenerator)());
}

// FIXME: Remove this interface once ES6 generators are in SpiderMonkey.
/**
 * Throws a ReturnValue exception to stop an asynchronous generator.
 *
 * This interface is a stop-gap measure to support generator return
 * values in older Firefox/SpiderMonkey.  In browsers that support ES6
 * generators like Chromium 29, just use "return" in your generator
 * functions.
 *
 * @param value the return value for the surrounding generator
 * @throws ReturnValue exception with the value.
 * @example
 * // ES6 style
 * Q.async(function* () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      return foo + bar;
 * })
 * // Older SpiderMonkey style
 * Q.async(function () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      Q.return(foo + bar);
 * })
 */
Q["return"] = _return;
function _return(value) {
    throw new QReturnValue(value);
}

/**
 * The promised function decorator ensures that any promise arguments
 * are settled and passed as values (`this` is also settled and passed
 * as a value).  It will also ensure that the result of a function is
 * always a promise.
 *
 * @example
 * var add = Q.promised(function (a, b) {
 *     return a + b;
 * });
 * add(Q(a), Q(B));
 *
 * @param {function} callback The function to decorate
 * @returns {function} a function that has been decorated.
 */
Q.promised = promised;
function promised(callback) {
    return function () {
        return spread([this, all(arguments)], function (self, args) {
            return callback.apply(self, args);
        });
    };
}

/**
 * sends a message to a value in a future turn
 * @param object* the recipient
 * @param op the name of the message operation, e.g., "when",
 * @param args further arguments to be forwarded to the operation
 * @returns result {Promise} a promise for the result of the operation
 */
Q.dispatch = dispatch;
function dispatch(object, op, args) {
    return Q(object).dispatch(op, args);
}

Promise.prototype.dispatch = function (op, args) {
    var self = this;
    var deferred = defer();
    Q.nextTick(function () {
        self.promiseDispatch(deferred.resolve, op, args);
    });
    return deferred.promise;
};

/**
 * Gets the value of a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to get
 * @return promise for the property value
 */
Q.get = function (object, key) {
    return Q(object).dispatch("get", [key]);
};

Promise.prototype.get = function (key) {
    return this.dispatch("get", [key]);
};

/**
 * Sets the value of a property in a future turn.
 * @param object    promise or immediate reference for object object
 * @param name      name of property to set
 * @param value     new value of property
 * @return promise for the return value
 */
Q.set = function (object, key, value) {
    return Q(object).dispatch("set", [key, value]);
};

Promise.prototype.set = function (key, value) {
    return this.dispatch("set", [key, value]);
};

/**
 * Deletes a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to delete
 * @return promise for the return value
 */
Q.del = // XXX legacy
Q["delete"] = function (object, key) {
    return Q(object).dispatch("delete", [key]);
};

Promise.prototype.del = // XXX legacy
Promise.prototype["delete"] = function (key) {
    return this.dispatch("delete", [key]);
};

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param value     a value to post, typically an array of
 *                  invocation arguments for promises that
 *                  are ultimately backed with `resolve` values,
 *                  as opposed to those backed with URLs
 *                  wherein the posted value can be any
 *                  JSON serializable object.
 * @return promise for the return value
 */
// bound locally because it is used by other methods
Q.mapply = // XXX As proposed by "Redsandro"
Q.post = function (object, name, args) {
    return Q(object).dispatch("post", [name, args]);
};

Promise.prototype.mapply = // XXX As proposed by "Redsandro"
Promise.prototype.post = function (name, args) {
    return this.dispatch("post", [name, args]);
};

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param ...args   array of invocation arguments
 * @return promise for the return value
 */
Q.send = // XXX Mark Miller's proposed parlance
Q.mcall = // XXX As proposed by "Redsandro"
Q.invoke = function (object, name /*...args*/) {
    return Q(object).dispatch("post", [name, array_slice(arguments, 2)]);
};

Promise.prototype.send = // XXX Mark Miller's proposed parlance
Promise.prototype.mcall = // XXX As proposed by "Redsandro"
Promise.prototype.invoke = function (name /*...args*/) {
    return this.dispatch("post", [name, array_slice(arguments, 1)]);
};

/**
 * Applies the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param args      array of application arguments
 */
Q.fapply = function (object, args) {
    return Q(object).dispatch("apply", [void 0, args]);
};

Promise.prototype.fapply = function (args) {
    return this.dispatch("apply", [void 0, args]);
};

/**
 * Calls the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q["try"] =
Q.fcall = function (object /* ...args*/) {
    return Q(object).dispatch("apply", [void 0, array_slice(arguments, 1)]);
};

Promise.prototype.fcall = function (/*...args*/) {
    return this.dispatch("apply", [void 0, array_slice(arguments)]);
};

/**
 * Binds the promised function, transforming return values into a fulfilled
 * promise and thrown errors into a rejected one.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q.fbind = function (object /*...args*/) {
    var promise = Q(object);
    var args = array_slice(arguments, 1);
    return function fbound() {
        return promise.dispatch("apply", [
            this,
            args.concat(array_slice(arguments))
        ]);
    };
};
Promise.prototype.fbind = function (/*...args*/) {
    var promise = this;
    var args = array_slice(arguments);
    return function fbound() {
        return promise.dispatch("apply", [
            this,
            args.concat(array_slice(arguments))
        ]);
    };
};

/**
 * Requests the names of the owned properties of a promised
 * object in a future turn.
 * @param object    promise or immediate reference for target object
 * @return promise for the keys of the eventually settled object
 */
Q.keys = function (object) {
    return Q(object).dispatch("keys", []);
};

Promise.prototype.keys = function () {
    return this.dispatch("keys", []);
};

/**
 * Turns an array of promises into a promise for an array.  If any of
 * the promises gets rejected, the whole array is rejected immediately.
 * @param {Array*} an array (or promise for an array) of values (or
 * promises for values)
 * @returns a promise for an array of the corresponding values
 */
// By Mark Miller
// http://wiki.ecmascript.org/doku.php?id=strawman:concurrency&rev=1308776521#allfulfilled
Q.all = all;
function all(promises) {
    return when(promises, function (promises) {
        var pendingCount = 0;
        var deferred = defer();
        array_reduce(promises, function (undefined, promise, index) {
            var snapshot;
            if (
                isPromise(promise) &&
                (snapshot = promise.inspect()).state === "fulfilled"
            ) {
                promises[index] = snapshot.value;
            } else {
                ++pendingCount;
                when(
                    promise,
                    function (value) {
                        promises[index] = value;
                        if (--pendingCount === 0) {
                            deferred.resolve(promises);
                        }
                    },
                    deferred.reject,
                    function (progress) {
                        deferred.notify({ index: index, value: progress });
                    }
                );
            }
        }, void 0);
        if (pendingCount === 0) {
            deferred.resolve(promises);
        }
        return deferred.promise;
    });
}

Promise.prototype.all = function () {
    return all(this);
};

/**
 * Returns the first resolved promise of an array. Prior rejected promises are
 * ignored.  Rejects only if all promises are rejected.
 * @param {Array*} an array containing values or promises for values
 * @returns a promise fulfilled with the value of the first resolved promise,
 * or a rejected promise if all promises are rejected.
 */
Q.any = any;

function any(promises) {
    if (promises.length === 0) {
        return Q.resolve();
    }

    var deferred = Q.defer();
    var pendingCount = 0;
    array_reduce(promises, function (prev, current, index) {
        var promise = promises[index];

        pendingCount++;

        when(promise, onFulfilled, onRejected, onProgress);
        function onFulfilled(result) {
            deferred.resolve(result);
        }
        function onRejected() {
            pendingCount--;
            if (pendingCount === 0) {
                deferred.reject(new Error(
                    "Can't get fulfillment value from any promise, all " +
                    "promises were rejected."
                ));
            }
        }
        function onProgress(progress) {
            deferred.notify({
                index: index,
                value: progress
            });
        }
    }, undefined);

    return deferred.promise;
}

Promise.prototype.any = function () {
    return any(this);
};

/**
 * Waits for all promises to be settled, either fulfilled or
 * rejected.  This is distinct from `all` since that would stop
 * waiting at the first rejection.  The promise returned by
 * `allResolved` will never be rejected.
 * @param promises a promise for an array (or an array) of promises
 * (or values)
 * @return a promise for an array of promises
 */
Q.allResolved = deprecate(allResolved, "allResolved", "allSettled");
function allResolved(promises) {
    return when(promises, function (promises) {
        promises = array_map(promises, Q);
        return when(all(array_map(promises, function (promise) {
            return when(promise, noop, noop);
        })), function () {
            return promises;
        });
    });
}

Promise.prototype.allResolved = function () {
    return allResolved(this);
};

/**
 * @see Promise#allSettled
 */
Q.allSettled = allSettled;
function allSettled(promises) {
    return Q(promises).allSettled();
}

/**
 * Turns an array of promises into a promise for an array of their states (as
 * returned by `inspect`) when they have all settled.
 * @param {Array[Any*]} values an array (or promise for an array) of values (or
 * promises for values)
 * @returns {Array[State]} an array of states for the respective values.
 */
Promise.prototype.allSettled = function () {
    return this.then(function (promises) {
        return all(array_map(promises, function (promise) {
            promise = Q(promise);
            function regardless() {
                return promise.inspect();
            }
            return promise.then(regardless, regardless);
        }));
    });
};

/**
 * Captures the failure of a promise, giving an oportunity to recover
 * with a callback.  If the given promise is fulfilled, the returned
 * promise is fulfilled.
 * @param {Any*} promise for something
 * @param {Function} callback to fulfill the returned promise if the
 * given promise is rejected
 * @returns a promise for the return value of the callback
 */
Q.fail = // XXX legacy
Q["catch"] = function (object, rejected) {
    return Q(object).then(void 0, rejected);
};

Promise.prototype.fail = // XXX legacy
Promise.prototype["catch"] = function (rejected) {
    return this.then(void 0, rejected);
};

/**
 * Attaches a listener that can respond to progress notifications from a
 * promise's originating deferred. This listener receives the exact arguments
 * passed to ``deferred.notify``.
 * @param {Any*} promise for something
 * @param {Function} callback to receive any progress notifications
 * @returns the given promise, unchanged
 */
Q.progress = progress;
function progress(object, progressed) {
    return Q(object).then(void 0, void 0, progressed);
}

Promise.prototype.progress = function (progressed) {
    return this.then(void 0, void 0, progressed);
};

/**
 * Provides an opportunity to observe the settling of a promise,
 * regardless of whether the promise is fulfilled or rejected.  Forwards
 * the resolution to the returned promise when the callback is done.
 * The callback can return a promise to defer completion.
 * @param {Any*} promise
 * @param {Function} callback to observe the resolution of the given
 * promise, takes no arguments.
 * @returns a promise for the resolution of the given promise when
 * ``fin`` is done.
 */
Q.fin = // XXX legacy
Q["finally"] = function (object, callback) {
    return Q(object)["finally"](callback);
};

Promise.prototype.fin = // XXX legacy
Promise.prototype["finally"] = function (callback) {
    callback = Q(callback);
    return this.then(function (value) {
        return callback.fcall().then(function () {
            return value;
        });
    }, function (reason) {
        // TODO attempt to recycle the rejection with "this".
        return callback.fcall().then(function () {
            throw reason;
        });
    });
};

/**
 * Terminates a chain of promises, forcing rejections to be
 * thrown as exceptions.
 * @param {Any*} promise at the end of a chain of promises
 * @returns nothing
 */
Q.done = function (object, fulfilled, rejected, progress) {
    return Q(object).done(fulfilled, rejected, progress);
};

Promise.prototype.done = function (fulfilled, rejected, progress) {
    var onUnhandledError = function (error) {
        // forward to a future turn so that ``when``
        // does not catch it and turn it into a rejection.
        Q.nextTick(function () {
            makeStackTraceLong(error, promise);
            if (Q.onerror) {
                Q.onerror(error);
            } else {
                throw error;
            }
        });
    };

    // Avoid unnecessary `nextTick`ing via an unnecessary `when`.
    var promise = fulfilled || rejected || progress ?
        this.then(fulfilled, rejected, progress) :
        this;

    if (typeof process === "object" && process && process.domain) {
        onUnhandledError = process.domain.bind(onUnhandledError);
    }

    promise.then(void 0, onUnhandledError);
};

/**
 * Causes a promise to be rejected if it does not get fulfilled before
 * some milliseconds time out.
 * @param {Any*} promise
 * @param {Number} milliseconds timeout
 * @param {Any*} custom error message or Error object (optional)
 * @returns a promise for the resolution of the given promise if it is
 * fulfilled before the timeout, otherwise rejected.
 */
Q.timeout = function (object, ms, error) {
    return Q(object).timeout(ms, error);
};

Promise.prototype.timeout = function (ms, error) {
    var deferred = defer();
    var timeoutId = setTimeout(function () {
        if (!error || "string" === typeof error) {
            error = new Error(error || "Timed out after " + ms + " ms");
            error.code = "ETIMEDOUT";
        }
        deferred.reject(error);
    }, ms);

    this.then(function (value) {
        clearTimeout(timeoutId);
        deferred.resolve(value);
    }, function (exception) {
        clearTimeout(timeoutId);
        deferred.reject(exception);
    }, deferred.notify);

    return deferred.promise;
};

/**
 * Returns a promise for the given value (or promised value), some
 * milliseconds after it resolved. Passes rejections immediately.
 * @param {Any*} promise
 * @param {Number} milliseconds
 * @returns a promise for the resolution of the given promise after milliseconds
 * time has elapsed since the resolution of the given promise.
 * If the given promise rejects, that is passed immediately.
 */
Q.delay = function (object, timeout) {
    if (timeout === void 0) {
        timeout = object;
        object = void 0;
    }
    return Q(object).delay(timeout);
};

Promise.prototype.delay = function (timeout) {
    return this.then(function (value) {
        var deferred = defer();
        setTimeout(function () {
            deferred.resolve(value);
        }, timeout);
        return deferred.promise;
    });
};

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided as an array, and returns a promise.
 *
 *      Q.nfapply(FS.readFile, [__filename])
 *      .then(function (content) {
 *      })
 *
 */
Q.nfapply = function (callback, args) {
    return Q(callback).nfapply(args);
};

Promise.prototype.nfapply = function (args) {
    var deferred = defer();
    var nodeArgs = array_slice(args);
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided individually, and returns a promise.
 * @example
 * Q.nfcall(FS.readFile, __filename)
 * .then(function (content) {
 * })
 *
 */
Q.nfcall = function (callback /*...args*/) {
    var args = array_slice(arguments, 1);
    return Q(callback).nfapply(args);
};

Promise.prototype.nfcall = function (/*...args*/) {
    var nodeArgs = array_slice(arguments);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Wraps a NodeJS continuation passing function and returns an equivalent
 * version that returns a promise.
 * @example
 * Q.nfbind(FS.readFile, __filename)("utf-8")
 * .then(console.log)
 * .done()
 */
Q.nfbind =
Q.denodeify = function (callback /*...args*/) {
    var baseArgs = array_slice(arguments, 1);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        Q(callback).fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
};

Promise.prototype.nfbind =
Promise.prototype.denodeify = function (/*...args*/) {
    var args = array_slice(arguments);
    args.unshift(this);
    return Q.denodeify.apply(void 0, args);
};

Q.nbind = function (callback, thisp /*...args*/) {
    var baseArgs = array_slice(arguments, 2);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        function bound() {
            return callback.apply(thisp, arguments);
        }
        Q(bound).fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
};

Promise.prototype.nbind = function (/*thisp, ...args*/) {
    var args = array_slice(arguments, 0);
    args.unshift(this);
    return Q.nbind.apply(void 0, args);
};

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback with a given array of arguments, plus a provided callback.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param {Array} args arguments to pass to the method; the callback
 * will be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nmapply = // XXX As proposed by "Redsandro"
Q.npost = function (object, name, args) {
    return Q(object).npost(name, args);
};

Promise.prototype.nmapply = // XXX As proposed by "Redsandro"
Promise.prototype.npost = function (name, args) {
    var nodeArgs = array_slice(args || []);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback, forwarding the given variadic arguments, plus a provided
 * callback argument.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param ...args arguments to pass to the method; the callback will
 * be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nsend = // XXX Based on Mark Miller's proposed "send"
Q.nmcall = // XXX Based on "Redsandro's" proposal
Q.ninvoke = function (object, name /*...args*/) {
    var nodeArgs = array_slice(arguments, 2);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    Q(object).dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

Promise.prototype.nsend = // XXX Based on Mark Miller's proposed "send"
Promise.prototype.nmcall = // XXX Based on "Redsandro's" proposal
Promise.prototype.ninvoke = function (name /*...args*/) {
    var nodeArgs = array_slice(arguments, 1);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

/**
 * If a function would like to support both Node continuation-passing-style and
 * promise-returning-style, it can end its internal promise chain with
 * `nodeify(nodeback)`, forwarding the optional nodeback argument.  If the user
 * elects to use a nodeback, the result will be sent there.  If they do not
 * pass a nodeback, they will receive the result promise.
 * @param object a result (or a promise for a result)
 * @param {Function} nodeback a Node.js-style callback
 * @returns either the promise or nothing
 */
Q.nodeify = nodeify;
function nodeify(object, nodeback) {
    return Q(object).nodeify(nodeback);
}

Promise.prototype.nodeify = function (nodeback) {
    if (nodeback) {
        this.then(function (value) {
            Q.nextTick(function () {
                nodeback(null, value);
            });
        }, function (error) {
            Q.nextTick(function () {
                nodeback(error);
            });
        });
    } else {
        return this;
    }
};

Q.noConflict = function() {
    throw new Error("Q.noConflict only works when Q is used as a global");
};

// All code before this point will be filtered from stack traces.
var qEndingLine = captureLine();

return Q;

});

}).call(this,require('_process'))
},{"_process":26}]},{},[1]);
