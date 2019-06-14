//控制层
app.controller('brandController', function ($scope, $controller, brandService) {

    //继承
    $controller('baseController', {$scope: $scope});//伪继承  建立连接通道

    //读取列表数据绑定到表单中
    $scope.findAll = function () {
        brandService.findAll().success(
            function (response) {
                $scope.list = response;
            }
        );
    };

    //分页  向controller层发起请求
    // brand/findPage.do?page=1&size=10
    $scope.findPage = function (page, rows) {
        brandService.findPage(page, rows).success(function (result) {
            //提交过后改变数据  放回数据
            $scope.list = result.rows;
            $scope.paginationConf.totalItems = result.total;//总记录

        });
    };
    //提交

    //    添加
    $scope.save = function () {
        var object = null;
        if ($scope.entity.id != null)//因为添加的时候不需要id 会自动增长
            object = brandService.update($scope.entity);
        else object=brandService.add($scope.entity);

        object.success(function (result) {
            if (result.success)
                $scope.reloadList();//重新加载
            else
                alert(result.message);
        });
    };
    //根据id查找品牌
    $scope.findId = function (id) {
        brandService.findId(id).success(function (result) {
            $scope.entity = result;
        });
    };

    $scope.delete = function () {
        if (confirm("你确定呀删除吗？"))
            brandService.delete($scope.selectIds).success(function (result) {
                if (result.success)
                    $scope.reloadList();//删除过后修改列表
            });
    };
    //搜索
    $scope.searchEntity = {};
    $scope.search = function (page, size) {
        brandService.search(page, size, $scope.searchEntity).success(function (result) {
            $scope.paginationConf.totalItems = result.total;
            $scope.list = result.rows;
        });
    };
});