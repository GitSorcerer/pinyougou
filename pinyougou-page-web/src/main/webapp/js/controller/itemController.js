app.controller('itemController', function ($scope,$http) {
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
	
		//查询SKU
    searchSku = function () {
        for (var i = 0; i < skuList.length; i++) {
            if (matchObject(skuList[i].spec, $scope.specificationItems)) {
                $scope.sku = skuList[i];
                return;
            }
        }
        $scope.sku = {id: 0, title: '--------', price: 0};//如果没有匹配的
    };
	//在用户选择规格后触发读取方法
	//用户选择规格
	$scope.selectSpecification=function(name,value){	
			$scope.specificationItems[name]=value;
			searchSku();//读取sku
	};

    $scope.addToCart = function () {
        // alert('skuid:'+$scope.sku.id);
        // {'withCredentials':true}  true跨域请求允许携带cookie
        $http.get('http://localhost:9107/cart/addGoodsToCartList.do?itemId='
            + $scope.sku.id + '&num=' + $scope.num,{'withCredentials':true}).success(function (result) {
            if (result.success) location.href = "http://localhost:9107/cart.html";
            else alert(result.message);
        });
    };
});
