angular.module('budgie').service('UserService', [
  '$http',
  function service($http) {
    const se = this;
    const LOCAL_TOKEN_KEY = 'yourTokenKey';
    const username = '';
    const isAuthenticated = false;
    let authToken;

    se.currentUser = {};

    function loadUserCredentials() {
      const token = window.localStorage.getItem(LOCAL_TOKEN_KEY);

      if (token) {
        useCredentials(token);
      }
    }

    loadUserCredentials();

    function useCredentials(token) {
      const local = token.split('|')[0]
      console.log(local);
      se.currentUser = JSON.parse(local);
      console.log(token);
      console.log(se.currentUser);
      se.isAuthenticated = true;
      se.authToken = token;
      // Set the token as header for your requests!
      $http.defaults.headers.common['X-Auth-Token'] = token;
    }

    function storeUserCredentials(token) {
      window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
      useCredentials(token);
    }

    se.signUp = function(userData) {
      return $http.post('http://ec2-18-220-68-160.us-east-2.compute.amazonaws.com:8001/users/signup', userData).then(function(result) {
        se.currentUser = result.data[0];
        storeUserCredentials(JSON.stringify(result.data) + '|yourServerToken');
      });
    };

    se.login = function(userData) {
      return $http.post('http://ec2-18-220-68-160.us-east-2.compute.amazonaws.com:8001/users', userData).then(function(result) {
        se.currentUser = result.data;
        storeUserCredentials(JSON.stringify(result.data) + '|yourServerToken');
      });
    };

    se.logout = function() {
      se.destroyUserCredentials();
    };

    function destroyUserCredentials() {
      se.authToken = undefined;
      se.isAuthenticated = false;
      $http.defaults.headers.common['X-Auth-Token'] = undefined;
      window.localStorage.removeItem(LOCAL_TOKEN_KEY);
      se.currentUser = undefined;
    }
  }
]).constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
}).factory('AuthInterceptor', function($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function(response) {
      $rootScope.$broadcast(
      {401: AUTH_EVENTS.notAuthenticated, 403: AUTH_EVENTS.notAuthorized}[response.status], response);
      return $q.reject(response);
    }
  };
}).config(function($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});
