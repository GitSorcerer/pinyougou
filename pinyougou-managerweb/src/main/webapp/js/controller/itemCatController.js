//控制层
app.controller('itemCatController', function ($scope, $controller, itemCatService,typeTemplateService) {

    $controller('baseController', {$scope: $scope});//继承

    //读取列表数据绑定到表单中  
    $scope.findAll = function () {
        itemCatService.findAll().success(
            function (response) {
                $scope.list = response;
            }
        );
    };
    //分页
    $scope.findPage = function (page, rows) {
        itemCatService.findPage(page, rows).success(
            function (response) {
                $scope.list = response.rows;
                $scope.paginationConf.totalItems = response.total;//更新总记录数
            }
        );
    };

    //查询实体
    $scope.findOne = function (id) {
        itemCatService.findOne(id).success(
            function (response) {
                $scope.entity = response;
            }
        );
    };

    //保存
    $scope.save = function () {
        var serviceObject;//服务层对象
        if ($scope.entity.id != null) {//如果有ID
            serviceObject = itemCatService.update($scope.entity); //修改
        } else {
            // alert("save父级id:" + $scope.parentId);
            $scope.entity.parentId = $scope.parentId;//将父级id赋给entity
            serviceObject = itemCatService.add($scope.entity);//增加
        }
        serviceObject.success(
            function (response) {
                if (response.success) {
                    //重新查询
                    $scope.findParentById($scope.entity.parentId);
                    // $scope.reloadList();//重新加载
                } else {
                    alert(response.message);
                }
            }
        );
    };


    //批量删除
    $scope.dele = function () {
        //获取选中的复选框
        itemCatService.dele($scope.selectIds).success(
            function (response) {
                if (response.success) {
                    $scope.findParentById($scope.entity.parentId);
                    // $scope.reloadList();//刷新列表
                    $scope.selectIds = [];
                }
            }
        );
    };

    $scope.searchEntity = {};//定义搜索对象

    //搜索
    $scope.search = function (page, rows) {
        //添加后重新加载当前页面
        $scope.findParentById($scope.searchEntity.parentId);


        $scope.searchEntity.parentId = $scope.parentId;
        itemCatService.search(page, rows, $scope.searchEntity).success(
            function (response) {
                $scope.list = response.rows;
                $scope.paginationConf.totalItems = response.total;//更新总记录数
            }
        );
    };
    $scope.parentId=0;//用于记录上一级id
    $scope.findParentById = function (parentId) {
        $scope.parentId=parentId;
        // alert("findParentById:"+parentId);
        itemCatService.findParentById(parentId).success(function (result) {
            $scope.list = result;
        });
    };
    $scope.grade = 1;//用来区分等级   默认为 一级 菜单
    $scope.setGrade = function (val) {
        $scope.grade=val;
    };
    $scope.entity_1=null;
    $scope.entity_2=null;
    $scope.selectList = function (p_entity) {
        // alert("selectList:"+p_entity.id);
        //如果为一级菜单  entity_1 entity_2默认都为空
        if($scope.grade==1){
            $scope.entity_1=null;
            $scope.entity_2=null;
        }
        if($scope.grade==2){
            $scope.entity_1 = p_entity;
            $scope.entity_2 = null;
        }
        if($scope.grade==3)
            $scope.entity_2 = p_entity;
        $scope.findParentById(p_entity.id);
    };


    $scope.typeTempAll={data: []};
    $scope.typeTemplateAll=function () {
        typeTemplateService.findAll().success(function (result) {
            $scope.typeTemplates = result;
         /*   var temp=[];
            for(var i=0;i<result.length;++i){
                // alert(result[i].id+"  "+result[i].name)
                temp[result[i].id]=result[i].name;
                alert(temp[result[i].id]);
            }
            // alert("====="+JSON.parse(temp));
            $scope.typeTempAll = {data: temp};*/
        });
    }
});
