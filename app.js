var yearbookSignApp = angular.module('yearbookSignApp', ['ui.router', 'ngCookies']);

var baseTomcatUrl = "http://127.0.0.1:8080/";
var baseUrl = "http://127.0.0.1/";

yearbookSignApp.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/login');

    $stateProvider

        .state('login', {
            url: '/login',
            templateUrl: 'login.html',
            controller: 'loginController'
        })

        .state('sign-up', {
            url: '/sign-up',
            templateUrl: 'sign-up.html',
            controller: 'signUpController'
        })

        .state('forgot', {
            url: '/forgot',
            templateUrl: 'forgot.html',
            controller: 'forgotController'
        })

        .state('home', {
            url: '/home',
            templateUrl: 'invites.html',
            controller: 'homeController'
        })

});

yearbookSignApp.controller('homeController', function ($scope, $http, $cookies, $state) {
});

yearbookSignApp.controller('forgotController', function ($scope, $http, $cookies, $state) {

    $scope.otpSent = false;

    $scope.continue = function () {

        if($scope.otpSent){
            alert("OTP Resent.");
        }else{
            $scope.otpSent = true;
        }

        $http({
            method: 'GET',
            url: baseTomcatUrl+'users/OTP?email=' + $scope.email
        }).then(function successCallback(response) {
            $scope.sessionId = response.data;


        }, function errorCallback(response) {
            // The next bit of code is asynchronously tricky.
            alert("We encountered an error while verifying your email. Please reload and try again");
            console.log(response)

        });

    };

    $scope.signUp = function () {
        $http({
            method: 'POST',
            url: baseTomcatUrl+'users/create',
            data: {
                "firstName": $scope.firstName,
                "lastName": $scope.lastName,
                "sessionId": $scope.sessionId,
                "password": $scope.password,
                "otp": $scope.otp,



            },
        }).then(function successCallback(response) {
            $cookies.put("email", $scope.email);
            $cookies.put("password", $scope.password);
            alert("Sign Up Complete!");

            $state.go('home');


        }, function errorCallback(response) {
            // The next bit of code is asynchronously tricky.
            alert("Sign Up Failed, Please try again");
            console.log(response)

        });

    };




});


yearbookSignApp.controller('signUpController', function ($scope, $http, $cookies, $state) {

    $scope.otpSent = false;

    $scope.continue = function () {

        if($scope.otpSent){
            alert("OTP Resent.");
        }else{
            $scope.otpSent = true;
        }

        $http({
            method: 'GET',
            url: baseTomcatUrl+'users/OTP?email=' + $scope.email
        }).then(function successCallback(response) {
            $scope.sessionId = response.data;


        }, function errorCallback(response) {
            // The next bit of code is asynchronously tricky.
            alert("We encountered an error while verifying your email. Please reload and try again");
            console.log(response)

        });

    };

    $scope.signUp = function () {
        $http({
            method: 'POST',
            url: baseTomcatUrl+'users/create',
            data: {
                "firstName": $scope.firstName,
                "lastName": $scope.lastName,
                "sessionId": $scope.sessionId,
                "password": $scope.password,
                "otp": $scope.otp,



            },
        }).then(function successCallback(response) {
            $cookies.put("email", $scope.email);
            $cookies.put("password", $scope.password);
            alert("Sign Up Complete!");

            $state.go('home');



        }, function errorCallback(response) {
            // The next bit of code is asynchronously tricky.
            alert("Sign Up Failed, Please try again");
            console.log(response)

        });

    };




});

yearbookSignApp.controller('loginController', function ($scope, $http, $cookies, $state) {

    $scope.logInTrue = true;

    $scope.login = function () {
        $http({
            method: 'POST',
            url: baseTomcatUrl+'users/verify',
            data: {
                "email": $scope.email,
                "password": $scope.password
            },
        }).then(function successCallback(response) {
            $scope.response = response.data;
            $cookies.put("email", $scope.email);
            $cookies.put("password", $scope.password);

            $state.go('home');


        }, function errorCallback(response) {
            // The next bit of code is asynchronously tricky.
            alert("Login Failed, Please try again");
            console.log(response)

        });

    };




});