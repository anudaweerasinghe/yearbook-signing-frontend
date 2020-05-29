var yearbookSignApp = angular.module('yearbookSignApp', ['ui.router', 'ngCookies']);

// var baseTomcatUrl = "http://142.93.212.170:8080/autographs/";
var baseTomcatUrl = "http://127.0.0.1:8080/";

var baseUrl = "http://127.0.0.1/yearbook-autographs/";

yearbookSignApp.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

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
            controller: 'homeController',
            resolve: {authenticate: authenticate}

        })

        .state('autographs', {
            url: '/autographs',
            templateUrl: 'autographs.html',
            controller: 'autographsController',
            resolve: {authenticate: authenticate}

        })

        .state('page', {
            url: '/page',
            templateUrl: 'pdf.html',
            controller: 'pageController',
            resolve: {authenticate: authenticate}

        })

});

function authenticate($q, $http, $state, $timeout, $cookies) {
    var email = $cookies.get("email");
    var password = $cookies.get("password");

    if (email != null && password != null) {
        $http({
            method: 'POST',
            url: baseTomcatUrl+'users/verify',
            data: {
                "email": email,
                "password": password
            },
            transformResponse: []
        }).then(function successCallback(response) {
            return $q.when()         //Allow access to page
        }, function errorCallback(response) {
            alert("Fail");      //Show unauthorized error
            $timeout(function () {
                $state.go('login')      //Redirect to login page
            });
            return $q.reject()      //Reject request for access to the page

        });
    } else {
        $state.go('login');
    }
}


yearbookSignApp.controller('autographsController', function ($scope, $http, $cookies, $state){

    var email = $cookies.get("email");
    var password = $cookies.get("password");

    $http({
        method: 'POST',
        url: baseTomcatUrl+'messages/finished-messages',
        data: {
            "email": email,
            "password": password
        },
    }).then(function successCallback(response) {
        $scope.messages = response.data;


        for(var i=0; i<$scope.messages.length;i++){

            let ts = new Date($scope.messages[i].respondTime*1000);

            $scope.messages[i].respondTime = ts.toLocaleString();
        }


    }, function errorCallback(response) {
        // The next bit of code is asynchronously tricky.
        alert("Error retrieving data, Please try again");
        console.log(response)

    });

    $scope.logout = function () {

        $cookies.remove("email");
        $cookies.remove("password");

        $state.go('login')

    };

    $scope.goToPreview = function(){

        window.open(baseUrl+"#!/page");

    };
});

yearbookSignApp.controller('pageController', function ($scope, $http, $cookies, $state){

    var email = $cookies.get("email");
    var password = $cookies.get("password");

    $http({
        method: 'POST',
        url: baseTomcatUrl+'messages/finished-messages',
        data: {
            "email": email,
            "password": password
        },
    }).then(function successCallback(response) {
        $scope.messages = response.data;


        for(var i=0; i<$scope.messages.length;i++){

            let ts = new Date($scope.messages[i].respondTime*1000);

            $scope.messages[i].respondTime = ts.toLocaleString();
        }


    }, function errorCallback(response) {
        // The next bit of code is asynchronously tricky.
        alert("Error retrieving data, Please try again");
        console.log(response)

    });

    $scope.logout = function () {

        $cookies.remove("email");
        $cookies.remove("password");

        $state.go('login')

    };
});


yearbookSignApp.controller('homeController', function ($scope, $http, $cookies, $state) {

    var email = $cookies.get("email");
    var password = $cookies.get("password");

    $scope.inviteLabel = "You invited 0 People to Sign your Yearbook";
    $scope.notificationLabel = "0 people are waiting for you to Sign their Yearbook";

    $scope.signId = 0;


    $http({
        method: 'POST',
        url: baseTomcatUrl+'messages/get-messages',
        data: {
            "email": email,
            "password": password
        },
    }).then(function successCallback(response) {
        $scope.invites = response.data;

        if($scope.invites.length===1){
            $scope.inviteLabel = "You invited 1 Person to Sign your Yearbook"
        }else{
            $scope.inviteLabel = "You invited "+$scope.invites.length+" People to Sign your Yearbook"
        }

        for(var i=0; i<$scope.invites.length;i++){

            let ts = new Date($scope.invites[i].inviteTime*1000);

            $scope.invites[i].inviteTime = ts.toLocaleString();
        }


    }, function errorCallback(response) {
        // The next bit of code is asynchronously tricky.
        alert("Error retrieving data, Please try again");
        console.log(response)

    });

    $http({
        method: 'POST',
        url: baseTomcatUrl+'messages/get-invites',
        data: {
            "email": email,
            "password": password
        },
    }).then(function successCallback(response) {
        $scope.notifications = response.data;

        if($scope.notifications.length===1){
            $scope.notificationLabel = "1 person wants you to Sign their Yearbook"
        }else{
            $scope.notificationLabel = $scope.notifications.length+" people are waiting for you to Sign their Yearbook"
        }

        for(var i=0; i<$scope.notifications.length;i++){

            let ts = new Date($scope.notifications[i].inviteTime*1000);

            $scope.notifications[i].inviteTime = ts.toLocaleString();
        }


    }, function errorCallback(response) {
        // The next bit of code is asynchronously tricky.
        alert("Error retrieving data, Please try again");
        console.log(response)

    });

    $http({
        method: 'GET',
        url: baseTomcatUrl+'users'
    }).then(function successCallback(response) {
        $scope.users = response.data;

    }, function errorCallback(response) {
        // The next bit of code is asynchronously tricky.
        alert("We encountered an error while retrieving data");
        console.log(response)
    });

    $scope.sendInvite = function(){

        $http({
            method: 'POST',
            url: baseTomcatUrl+'messages/send-invite?recipientId='+$scope.recipient,
            data: {
                "email": email,
                "password": password
            },
        }).then(function successCallback(response) {

            window.location.reload();


        }, function errorCallback(response) {
            // The next bit of code is asynchronously tricky.
            alert("Error sending invite, Please try again");
            console.log(response)

        });

    };

    $scope.changeSignId =  function (messageId, name) {

        $scope.signId = messageId;
        $scope.label = "Sign "+name+"'s Yearbook";
        $scope.message = "";

    };

    $scope.sendMessage = function(){

        $http({
            method: 'POST',
            url: baseTomcatUrl+'messages/respond',
            data: {
                "email": email,
                "password": password,
                "message": $scope.message,
                "messageId": $scope.signId
            },
        }).then(function successCallback(response) {

            window.location.reload();
            alert("Message sent successfully");


        }, function errorCallback(response) {
            // The next bit of code is asynchronously tricky.
            alert("Error sending invite, Please try again");
            console.log(response)

        });

    };

    $scope.logout = function () {

        $cookies.remove("email");
        $cookies.remove("password");

        $state.go('login')

    };

    $scope.viewResponses = function(){

        $state.go('autographs');
    };




});

yearbookSignApp.controller('forgotController', function ($scope, $http, $cookies, $state) {

    $scope.otpSent = false;

    $scope.continue = function () {

        var res = $scope.email.split("@");

        if(res[1]!="osc.lk"){


            alert("Please use your OSC.lk email address");

        }else {

            if ($scope.otpSent) {
                alert("OTP Resent.");
            } else {
                $scope.otpSent = true;
            }

            $http({
                method: 'GET',
                url: baseTomcatUrl + 'users/OTP?email=' + $scope.email
            }).then(function successCallback(response) {
                $scope.sessionId = response.data;


            }, function errorCallback(response) {
                // The next bit of code is asynchronously tricky.
                alert("We encountered an error while verifying your email. Please reload and try again");
                console.log(response)

            });
        }

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
            alert("Password Reset Successfully!");

            $state.go('home');


        }, function errorCallback(response) {
            // The next bit of code is asynchronously tricky.
            alert("Password Reset Failed, Please try again");
            console.log(response)

        });

    };




});


yearbookSignApp.controller('signUpController', function ($scope, $http, $cookies, $state) {

    $scope.otpSent = false;

    $scope.continue = function () {

        var res = $scope.email.split("@");

        if(res[1]!="osc.lk"){


            alert("Please use your OSC.lk email address");

        }else {

            if ($scope.otpSent) {
                alert("OTP Resent.");
            } else {
                $scope.otpSent = true;
            }

            $http({
                method: 'GET',
                url: baseTomcatUrl + 'users/OTP?email=' + $scope.email
            }).then(function successCallback(response) {
                $scope.sessionId = response.data;


            }, function errorCallback(response) {
                // The next bit of code is asynchronously tricky.
                alert("We encountered an error while verifying your email. Please reload and try again");
                console.log(response)

            });
        }

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