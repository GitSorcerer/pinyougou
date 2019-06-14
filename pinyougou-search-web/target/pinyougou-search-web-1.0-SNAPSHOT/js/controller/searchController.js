app.controller('searchController', function ($scope,$location, searchService) {


    //搜索
    $scope.search = function () {
        searchService.search($scope.searchMap).success(
            function (response) {
                // alert(JSON.stringify(response.brandList));
                $scope.resultMap = response;//搜索返回的结果
                //将返回的结果转换成number
                $scope.searchMap.pageNo = parseInt($scope.searchMap.pageNo);
                buildPageLabel();
            }
        );
    };
    //                                                                          价格         当前页码   每页显示行数
    $scope.searchMap = {
        'keywords': '', 'category': '', 'brand': '', 'spec': {}, 'price': '', 'pageNo': 1, 'pageSize': 20
        , 'sortField': '', 'sort': ''
    };
    //添加面包屑
    $scope.addSearchItem = function (key, val) {
        if (key == 'category' || key == 'brand' || key == 'price')
            $scope.searchMap[key] = val;
        else $scope.searchMap.spec[key] = val;
        $scope.search();
    };
//    移除面包屑
    $scope.removeSearchItem = function (key) {
        if (key == 'category' || key == 'brand' || key == 'price')
            $scope.searchMap[key] = '';
        else delete $scope.searchMap.spec[key];
        $scope.search();
    };

//
    buildPageLabel = function () {
        //分页属性
        $scope.pageLabel = [];
        //得到最后页
        var maxPageNo = $scope.resultMap.totalPages;
        var firstPage = 1;//开始页码
        var lastPage = maxPageNo;//截至页码
        $scope.firstDot = true;//前面有点
        $scope.lastDot = true;

        //如果总页数大于5
        if ($scope.resultMap.totalPages > 5) {
            //显示前五页
            if ($scope.searchMap.pageNo <= 3) {
                lastPage = 5;
                $scope.firstDot = false;
            }
            //如果当前页在最后的前两页  显示最后几页
            else if ($scope.searchMap.pageNo >= lastPage - 2) {
                firstPage = maxPageNo - 4;
                $scope.lastDot = false;
            }
            else {//否则显示中间几页
                firstPage = $scope.searchMap.pageNo - 2;
                lastPage = $scope.searchMap.pageNo + 2;
            }
        } else {//前后都无点
            $scope.firstDot = false;
            $scope.lastDot = false;
        }

        //    循环产生页码标签
        for (var i = firstPage; i <= lastPage; ++i)
            $scope.pageLabel.push(i);
    };

    //根据页码查询
    $scope.queryByPage = function (pageNo) {
        if (pageNo < 1 || pageNo > $scope.resultMap.totalPages) return;
        $scope.searchMap.pageNo = pageNo;
        $scope.search();
    };

    /*//    判断当前页为第一页
        $scope.isTopPage = function () {
            if($scope.searchMap.pageNo==1)
                return true;
            else return false;
        };
        //    判断当前页为最后一页
        $scope.isEndPage = function () {
            if($scope.searchMap.pageNo==$scope.resultMap.totalPages)
                return true;
            else return false;
        };*/

    //判断开始页和结尾页
    $scope.isPage = function (bool) {
        var page = null;
        if (bool) page = 1;
        else page = $scope.resultMap.totalPages;

        if ($scope.searchMap.pageNo == page)
            return true;
        else return false;
    };

    //排序
    $scope.sortSearch = function (sortField, sort) {
        $scope.searchMap.sortField = sortField;
        $scope.searchMap.sort = sort;
        $scope.search();
    };

//    判断搜索的是否 是关键字
    $scope.keywordsIsBrand = function () {
        for (var i = 0; i < $scope.resultMap.brandList.length; ++i) {
            //如果查询的条件 中存在 品牌  返回true
            if ($scope.searchMap.keywords.indexOf($scope.resultMap.brandList[i].text) >= 0)
                return true;
        }
        return false;
    };
//    用于接受主页的参数
    $scope.loadKeyWords = function () {
        $scope.searchMap.keywords = $location.search()['keywords'];
        $scope.search();
    };

});
