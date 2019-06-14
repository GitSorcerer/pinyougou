 //控制层 
 app.controller('userController', function ($scope, $controller, userService) {

     //添加用户  注册
     $scope.reg = function () {
         // alert("注册");
         if ($scope.entity.password != $scope.password) {
             alert("两次密码不一致，请重新输入");
             $scope.password = "";
             return;
         }
         userService.add($scope.entity,$scope.smscode).success(function (result) {
             alert(result.message);
         });
     };

     //发送验证码
     $scope.sendCode = function () {
         if ($scope.entity.phone == null) {
             alert("请输入手机号！");
             return;
         }
         userService.sendCode($scope.entity.phone).success(
             function (response) {
                 alert(response.message);
             }
         );
     };
 });
