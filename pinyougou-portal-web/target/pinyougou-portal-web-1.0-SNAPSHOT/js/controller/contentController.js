 //控制层 
 app.controller('contentController', function ($scope, contentService) {


     $scope.contentList = [];//广告集

     $scope.findByCategoryId = function (categoryId) {
         contentService.findByCategoryId(categoryId).success(function (result) {
             // alert(JSON.stringify(result));
             $scope.contentList[categoryId] = result;
         });
     };

     $scope.search = function () {
         location.href = "http://localhost:9104/search.html#?keywords="+$scope.keywords;
     };
 });
