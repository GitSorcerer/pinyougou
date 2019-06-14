//购物车服务层
app.service('cartService',function($http){
    //购物车列表
    this.findCartList = function () {
        return $http.get('cart/findCartList.do');
    };
    //添加商品到购物车
    this.addGoodsToCartList = function (itemId, num) {
        return $http.get('cart/addGoodsToCartList.do?itemId=' + itemId + '&num=' + num);
    };

    this.sum = function (cartList) {
        var totalVal={totalNum:0, totalMoney: 0.00};
        for(var i=0;i<cartList.length;++i) {
            var cart = cartList[i];
            for (var j = 0; j < cart.orderItemList.length; ++j) {
                var orderItem = cart.orderItemList[j];//得到购物车明细
                totalVal.totalNum += orderItem.num;
                totalVal.totalMoney += orderItem.totalFee;
            }
        }
        return totalVal;
    };

    this.findListByUserId = function () {
        return $http.get('address/findListByUserId.do');
    };
    //保存订单
    this.submitOrder=function(order){
        return $http.post('order/add.do',order);
    }


});
