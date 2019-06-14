//控制层
app.controller('typeTemplateController', function ($scope, $controller, typeTemplateService,brandService,specificationService) {

    $controller('baseController', {$scope: $scope});//继承

    //读取列表数据绑定到表单中  
    $scope.findAll = function () {
        typeTemplateService.findAll().success(
            function (response) {
                $scope.list = response;
            }
        );
    }

    //分页
    $scope.findPage = function (page, rows) {
        typeTemplateService.findPage(page, rows).success(
            function (response) {
                $scope.list = response.rows;
                $scope.paginationConf.totalItems = response.total;//更新总记录数
            }
        );
    }

    //查询实体
    $scope.findOne = function (id) {
        typeTemplateService.findOne(id).success(
            function (response) {
                $scope.entity = response;
                //将数据转换为json格式
                $scope.entity.brandIds = JSON.parse($scope.entity.brandIds);
                $scope.entity.specIds = JSON.parse($scope.entity.specIds);
                $scope.entity.customAttributeItems = JSON.parse($scope.entity.customAttributeItems);
            }
        );
    }

    //保存
    $scope.save = function () {
        var serviceObject;//服务层对象
        if ($scope.entity.id != null) {//如果有ID
            serviceObject = typeTemplateService.update($scope.entity); //修改
        } else {
            serviceObject = typeTemplateService.add($scope.entity);//增加
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
    };


    //批量删除
    $scope.dele = function () {
        //获取选中的复选框
        typeTemplateService.dele($scope.selectIds).success(
            function (response) {
                if (response.success) {
                    $scope.reloadList();//刷新列表
                    $scope.selectIds = [];
                }
            }
        );
    }

    $scope.searchEntity = {};//定义搜索对象

    //搜索
    $scope.search = function (page, rows) {
        typeTemplateService.search(page, rows, $scope.searchEntity).success(
            function (response) {
                $scope.list = response.rows;
                $scope.paginationConf.totalItems = response.total;//更新总记录数
            }
        );
    };
    //查询规格
    $scope.brandList = {data: []};
    $scope.findBrandList=function () {
        brandService.selectOptionList().success(function (result) {
            $scope.brandList={data:result };
        })
    };
    //查询规格选项
    $scope.specfList = {data: []};
    $scope.findSpecList = function () {
        specificationService.selectOptionList().success(function (result) {
            $scope.specfList = {data: result};
        });
    };
    $scope.entity={customAttributeItems:[]};
    //添加一行
    $scope.addTableRow = function () {
        $scope.entity.customAttributeItems.push({});
    };
    //移除一行
    $scope.delTableRow = function (index) {
        $scope.entity.customAttributeItems.splice(index, 1);
    };
    //json格式转换
    $scope.jSonToString = function (jsonString, key) {
        var json=JSON.parse(jsonString);
        var val="";
        for(var i=0;i<json.length;++i) {
            if (i > 0) val += ",";

            val += json[i][key];
        }
        return val;
    };

});
