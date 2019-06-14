//控制层
app.controller('goodsController', function ($scope, $controller, $location, goodsService, itemCatService) {

    $controller('baseController', {$scope: $scope});//继承

    //读取列表数据绑定到表单中  
    $scope.findAll = function () {
        goodsService.findAll().success(
            function (response) {
                $scope.list = response;
            }
        );
    };
    //分页
    $scope.findPage = function (page, rows) {
        goodsService.findPage(page, rows).success(
            function (response) {
                $scope.list = response.rows;
                $scope.paginationConf.totalItems = response.total;//更新总记录数
            }
        );
    }

    //查询实体
    $scope.findOne = function () {
        var id = $location.search()['id'];
        // alert(id);
        goodsService.findOne(id).success(
            function (response) {
                // alert(JSON.stringify(response));

                $scope.entity = response;

                editor.html(response.goodsDesc.introduction);
                //将图片详细转换未json格式
                // alert("图片："+JSON.stringify(response.goodsDesc.itemImages));

                $scope.entity.goodsDesc.itemImages = JSON.parse(response.goodsDesc.itemImages);
                //扩展属性
                // alert("扩展属性："+JSON.stringify($scope.entity.goodsDesc.customAttributeItems));

                $scope.entity.goodsDesc.customAttributeItems = JSON.parse($scope.entity.goodsDesc.customAttributeItems);
                //规格
                // alert("规格："+JSON.stringify($scope.entity.goodsDesc.specificationItems));

                $scope.entity.goodsDesc.specificationItems = JSON.parse($scope.entity.goodsDesc.specificationItems);

                // alert(JSON.stringify($scope.entity.itemList));
                //列出规格
                for (var i = 0; i < $scope.entity.itemList.length; ++i) {
                    $scope.entity.itemList[i].spec = JSON.parse($scope.entity.itemList[i].spec);
                }
            }
        );
    }

    //保存
    $scope.save = function () {
        var serviceObject;//服务层对象
        if ($scope.entity.id != null) {//如果有ID
            serviceObject = goodsService.update($scope.entity); //修改
        } else {
            serviceObject = goodsService.add($scope.entity);//增加
        }
        serviceObject.success(
            function (response) {
                if (response.success) {
                    //重新查询
                    $scope.reloadList();//重新加载
                } else {
                    alert(response.message);
                }
            }
        );
    }


    //批量删除
    $scope.dele = function () {
        //获取选中的复选框
        goodsService.dele($scope.selectIds).success(
            function (response) {
                if (response.success) {
                    $scope.reloadList();//刷新列表
                    $scope.selectIds = [];
                    alert(response.message);
                }else alert(response.message);
            }
        );
    }

    $scope.searchEntity = {};//定义搜索对象

    //搜索
    $scope.search = function (page, rows) {
        goodsService.search(page, rows, $scope.searchEntity).success(
            function (response) {
                $scope.list = response.rows;
                $scope.paginationConf.totalItems = response.total;//更新总记录数
            }
        );
    };
    $scope.status = ['未审核', '已审核', '审核为通过', '关闭',];
    $scope.itemCatList = function () {
        itemCatService.findAll().success(function (result) {
            for (var i = 0; i < result.length; ++i) {
                $scope.itemCatList[result[i].id] = result[i].name;
            }

        });

    };

    //    显示以及下拉框   一级下拉框
    $scope.selectItemCat1List = function () {
        // alert("============selectItemCat1List============");
        itemCatService.findParentById(0).success(function (result) {
            // alert(result);
            $scope.itemCat1List = result;
        });
    };
    //二级下拉框
    $scope.$watch('entity.goods.category1Id', function (newVal, oldVal) {
        itemCatService.findParentById(newVal).success(function (result) {
            $scope.itemCat2List = result;
        });
    });
    //三级下拉框
    $scope.$watch('entity.goods.category2Id', function (newVal, oldVal) {
        itemCatService.findParentById(newVal).success(function (result) {
            // alert(result);
            $scope.itemCat3List = result;
        });
    });
    //当三级下拉框值选的时
    $scope.$watch('entity.goods.category3Id', function (newVal, oldVal) {
        itemCatService.findOne(newVal).success(function (result) {
            $scope.entity.goods.typeTemplateId = result.typeId;
        });
    });
//  审核
    $scope.updateStatus = function (status) {
        // alert($scope.selectIds+"========="+status);
        goodsService.updateStatus($scope.selectIds, status).success(function (result) {
            if (result.success) {
                //刷新列表
                $scope.reloadList();
                //将数组清空
                $scope.selectIds = [];
                alert(result.message);
            }
            else alert(result.message);
        });
    };

});	
