app.controller('indexController', function ($scope, $controller, loginService) {
    $scope.showLoginName = function () {
        loginService.loginName().success(function (result) {
            $scope.userName=result.loginName;
        });
    };
});