//控制层
app.controller('seckillGoodsController' ,function($scope,seckillGoodsService,$location, $interval){
    //读取列表数据绑定到表单中
    $scope.findList = function () {
        // alert("========");
        seckillGoodsService.findList().success(
            function (response) {
                // alert(JSON.stringify(response));
                $scope.list = response;
            }
        );
    };

    $scope.findOne = function () {
        var id = $location.search()['id'];
        // alert(id + "   " + id.length);
        seckillGoodsService.findOne(id).success(function (result) {
            $scope.entity = result;
            //得到总秒数                   秒杀结束时间 (s)            -           当前时间     (s)
            allSecound = Math.floor((new Date($scope.entity.endTime).getTime() - new Date().getTime()) / 1000);
            time = $interval(function () {
                if(allSecound>0){
                    allSecound = allSecound - 1;
                    $scope.timeString = convertTimeString(allSecound);
                }else $interval.cancel(time);

            }, 1000);

        });
    };

    $scope.submitOrder = function () {
        seckillGoodsService.submitOrder($scope.entity.id).success(function (result) {
            if (result.success) {
                alert("下单成功，请在1分钟内完成支付！");
                location.href = "pay.html";
            }else alert(result.message);
        });
    };


    convertTimeString = function (allSecond) {//allSecond秒
        var days = Math.floor(allSecond / (60 * 60 * 24));//天数
        var hours = Math.floor((allSecond - days * 60 * 60 * 24) / (60 * 60));//小时
        var minutrs = Math.floor((allSecond - days * 60 * 60 * 24 - hours * 60 * 60) / 60);//分钟
        var seconds = allSecond - days * 60 * 60 * 24 - hours * 60 * 60 - minutrs * 60;//秒
        var timeString = "";
        if (days > 0) timeString += days + "天  ";
        $scope.len = seconds.length;
        if (seconds.length === 1) seconds = "0" + seconds;
        return timeString + hours + ":" + minutrs + ":" + seconds;
    };
});
