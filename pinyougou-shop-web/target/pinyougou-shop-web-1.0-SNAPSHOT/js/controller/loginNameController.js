app.controller('loginNameController', function ($scope, $controller, loginService) {
    loginService.loginName().success(function (result) {
        $scope.logName=result.loginName;
    });
});