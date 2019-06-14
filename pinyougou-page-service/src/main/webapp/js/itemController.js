app.controller('itemController', function ($scope) {
     //数量操作
    $scope.addNum = function (x) {
        $scope.num = $scope.num + x;
        if ($scope.num < 1) {
            $scope.num = 1;
        }
    };
//记录用户选择的规格
    $scope.specificationItems = {};
    //用户选择规格
    $scope.selectSpecification = function (name, val) {
        $scope.specificationItems[name] = val;
    };
//    判断规格是否被选中
    $scope.isSelected = function (name, val) {
        if ($scope.specificationItems[name] == val) return true;
        else return false;
    };
    //加载默认的SKU
    $scope.loadSku = function () {
        $scope.sku = skuList[0];
        $scope.specificationItems = JSON.parse(JSON.stringify($scope.sku.spec));
    };

    matchObject = function (map1, map2) {
        for(var k in map1)
            if(map1[k]!=map2[k]) return false;

        for(var k in map2)
            if(map1[k]!=map2[k]) return false;
        return true;
    };


});
