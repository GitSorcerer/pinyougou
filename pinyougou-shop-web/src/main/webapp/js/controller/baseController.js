//基本控制层
app.controller('baseController', function ($scope) {

    //参数为json格式   用于同步分页的相关数据
    $scope.paginationConf = {
        currentPage: 1,
        totalItems: 10,
        itemsPerPage: 10,
        perPageOptions: [10, 20, 30, 40, 50],
        onChange: function () {//状态改变时
            $scope.reloadList();
        }
    };

    $scope.reloadList = function () {
        //               当前页                               每页显示的行数
        // $scope.findPage($scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage);
        $scope.search($scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage);
    };

    //创建一个用来保存id的数组
    $scope.selectIds = [];
    $scope.updateCheck = function ($event, id) {
        if ($event.target.checked)//选中
            $scope.selectIds.push(id);//加入
        else {
            var idx = $scope.selectIds.indexOf(id);//根据id查找selectIds中的索引
            $scope.selectIds.splice(idx, 1);//从selectIds中删除
        }
    };

//    从集合中查找对象
    $scope.searchObjectByKey = function (list, key, val) {
        for(var i=0;i<list.length;++i){
            if(list[i][key]==val)
                return list[i];
        }
        return null;

    };


});
