//购物车控制层
app.controller('cartController',function($scope,cartService,addressService){
    //查询购物车列表
    $scope.findCartList = function () {
        cartService.findCartList().success(
            function (response) {
                alert(JSON.stringify(response));
                $scope.cartList = response;
                $scope.totalVal=cartService.sum($scope.cartList);
            }
        );
    };
    $scope.addGoodsToCartList = function (itemId, num) {
        cartService.addGoodsToCartList(itemId, num).success(function (result) {
            if (result.success) $scope.findCartList(); //刷新列表
            else alert(result.message);
        });
    };

    $scope.findListByUserId = function () {
        cartService.findListByUserId().success(function (result) {
            $scope.addressList = result;
            for(var i=0;i<$scope.addressList.length;++i){
                if($scope.addressList[i].isDefault=='1'){
                    $scope.address = $scope.addressList[i];
                    break;
                }
            }
        });
    };
    //单击是选取出地址
    $scope.selectAddress = function (adderss) {
        $scope.address = adderss;
    };
    //判断选定的地址是不是循环的地址  如果是 返回true
    $scope.isSelectedAddress = function (address) {
        if(address==$scope.address)
            return true;
        else return false;
    };

    $scope.order={paymentType: '1'};
    $scope.selectPayType = function (type) {
        $scope.order.paymentType = type;
    };

    //保存订单
    $scope.submitOrder=function(){
        $scope.order.receiverAreaName=$scope.address.address;//地址
        $scope.order.receiverMobile=$scope.address.mobile;//手机
        $scope.order.receiver=$scope.address.contact;//联系人
        cartService.submitOrder( $scope.order ).success(
            function(response){
                if(response.success){
                    // alert(response.message);
                       //页面跳转
                       if($scope.order.paymentType=='1'){//如果是微信支付，跳转到支付页面
                           location.href="pay.html";
                       }else{//如果货到付款，跳转到提示页面
                           location.href="paysuccess.html";
                       }
                }else{
                    alert(response.message);	//也可以跳转到提示页面
                }
            }
        );
    };


    //保存
    $scope.saveAddress=function(){
        alert(JSON.stringify($scope.entity));
        addressService.add($scope.entity).success(
            function(response){
                if(response.success){
                    //重新查询
                    location.href = "getOrderInfo.html";
                  /*  $scope.reloadList();//重新加载
                    $scope.findListByUserId();*/
                }else{
                    alert(response.message);
                }
            }
        );
    };

});
