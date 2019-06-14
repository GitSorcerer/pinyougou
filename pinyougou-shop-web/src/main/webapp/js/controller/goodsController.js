//控制层
app.controller('goodsController', function ($scope, $controller,$location,goodsService,uploadService,itemCatService,typeTemplateService) {

    $controller('baseController', {$scope: $scope});//继承

    //读取列表数据绑定到表单中  
    $scope.findAll = function () {
        goodsService.findAll().success(
            function (response) {
                $scope.list = response;
            }
        );
    }

    //分页
    $scope.findPage = function (page, rows) {
        goodsService.findPage(page, rows).success(
            function (response) {
                $scope.list = response.rows;
                $scope.paginationConf.totalItems = response.total;//更新总记录数
            }
        );
    }

    //查询实体   把id去掉  用于其他页面的传值
    $scope.findOne = function () {
        //获取id这个参数值
        var id=$location.search()['id'];
        // alert(id);
        if(id==null)   return;   //如果id为空直接退出这个方法
        //否则按照这个id查找对应的 goods 等相关信息
        goodsService.findOne(id).success(
            function (response) {
                $scope.entity = response;
                editor.html(response.goodsDesc.introduction);
                //将图片详细转换未json格式
                $scope.entity.goodsDesc.itemImages = JSON.parse(response.goodsDesc.itemImages);
                //扩展属性
                $scope.entity.goodsDesc.customAttributeItems = JSON.parse($scope.entity.goodsDesc.customAttributeItems);
                //规格
                $scope.entity.goodsDesc.specificationItems = JSON.parse($scope.entity.goodsDesc.specificationItems);

                // alert(JSON.stringify($scope.entity.itemList));
                //列出规格
                for(var i=0;i<$scope.entity.itemList.length;++i){
                    $scope.entity.itemList[i].spec=JSON.parse($scope.entity.itemList[i].spec);
                }

            }
        );
    };

    //保存
    $scope.save = function () {
        $scope.entity.goodsDesc.introduction = editor.html();
        var serviceObject;//服务层对象
        if ($scope.entity.goods.id != null) {//如果有ID
            serviceObject = goodsService.update($scope.entity); //修改
        } else {
            serviceObject = goodsService.add($scope.entity);//增加
        }
        serviceObject.success(
            function (response) {
                if (response.success) {
                    alert("保存成功！");
                    $scope.entity={};
                    editor.html('');
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
        goodsService.dele($scope.selectIds).success(
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
        goodsService.search(page, rows, $scope.searchEntity).success(
            function (response) {
                $scope.list = response.rows;
                $scope.paginationConf.totalItems = response.total;//更新总记录数
            }
        );
    };

    //保存的方法
    $scope.add = function () {
        //将富文本编辑器中的内容取出 放入 introduction中
        $scope.entity.goodsDesc.introduction=editor.html();
        goodsService.add($scope.entity).success(
            function (response) {
                if (response.success) {
                    //重新查询
                    // $scope.reloadList();//重新加载
                    alert(response.message);
                    $scope.entity={};
                    editor.html('');
                } else {
                    alert(response.message);
                }
            }
        );
    };
//    上传图片
    $scope.image_entity={};
    $scope.uploadFile = function () {
        // alert("21312312312");
        uploadService.uploadFile().success(function (result) {
            if (result.success) {
                // alert(result.message);
                $scope.image_entity.url = result.message;
                // alert("$scope.image_entity.url:"+$scope.image_entity.url);
            }
            else
                alert(result.message);
        });
/*            .error(function () {
            alert("上传发生错误！");
        });*/
    };

    $scope.entity = {goods: {}, goodsDesc: {itemImages: [],specificationItems:[]}};
    //上传图片后 遍历使用
    $scope.add_image_entity = function () {
        $scope.entity.goodsDesc.itemImages.push($scope.image_entity);
    };
    //移除图片
    $scope.removeImg = function (index) {
        $scope.entity.goodsDesc.itemImages.splice(index,1)
    };

//    显示以及下拉框   一级下拉框
    $scope.selectItemCat1List = function () {
        // alert("============selectItemCat1List============");
        itemCatService.findParentById(0).success(function (result) {
            // alert(result);
            $scope.itemCat1List =result;
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
            $scope.itemCat3List =result;
        });
    });
    //当三级下拉框值选的时
    $scope.$watch('entity.goods.category3Id', function (newVal, oldVal) {
        itemCatService.findOne(newVal).success(function (result) {
            $scope.entity.goods.typeTemplateId=result.typeId;
        });
    });
    //选择id后更新商品列表
    $scope.$watch('entity.goods.typeTemplateId', function (newVal, oldVal) {
        typeTemplateService.findOne(newVal).success(function (result) {
            //typeTemplate为类型规格
            $scope.typeTemplate=result;
            //将brandIds转换为json格式
            $scope.typeTemplate.brandIds=JSON.parse(result.brandIds);
            //扩展属性  最后保存到数据库
            //判断是增加还是修改
            if($location.search()['id']==null)
            $scope.entity.goodsDesc.customAttributeItems=JSON.parse(result.customAttributeItems);
        });
        typeTemplateService.findSpecList(newVal).success(function (result) {
            $scope.specList=result;
        });
    });

    $scope.updateSpecAttribute = function ($event, name, val) {
        var object = $scope.searchObjectByKey($scope.entity.goodsDesc.specificationItems, 'attributeName', name);
        //如果存在
        if (object != null) {
            //选中
            if ($event.target.checked) {
                object.attributeValue.push(val);
            } else {
                object.attributeValue.splice(object.attributeValue.indexOf(val), 1);
                //如果选择都取消了
                if (object.attributeValue.length == 0)
                    $scope.entity.goodsDesc.specificationItems.splice($scope.entity.goodsDesc.specificationItems.indexOf(object), 1);
            }
        } else {//如果值不存在
            $scope.entity.goodsDesc.specificationItems.push({"attributeName": name, "attributeValue": [val]})
        }
    };
    $scope.createItemList = function () {
        //默认初始化
        $scope.entity.itemList = [{spec: {}, price: 0, num: 99999, status: '0', isDefault: '0'}];

        var items=$scope.entity.goodsDesc.specificationItems;
        for(var i=0;i<items.length;++i)
            $scope.entity.itemList=addColumn($scope.entity.itemList,items[i].attributeName,items[i].attributeValue);
    };

    addColumn = function (list, columnName, columnVal) {
        var newList = [];
        for(var i=0;i<list.length;++i){
            var ordRow = list[i];
            for(var j=0;j<columnVal.length;++j){
                var newRows=JSON.parse(JSON.stringify(ordRow));
                newRows.spec[columnName] = columnVal[j];
                newList.push(newRows);
            }
        }
        return newList;
    };

//    定义一个状态数组
    $scope.status=['未审核','已审核','审核未通过','关闭'];

    $scope.itemCatList=[];
    //查询商品列表
    $scope.findItemCatList = function () {
        itemCatService.findAll().success(function (result) {
            for(var i=0;i<result.length;++i)
                $scope.itemCatList[result[i].id]=result[i].name;
        });

    };
//    勾选已有的规格
//     [{"attributeName":"网络制式","attributeValue":["移动3G","移动4G"]},{"attributeName":"屏幕尺寸","attributeValue":["6寸","5.5寸"]}]
    $scope.checkAttribteVal = function (specName, optionName) {
        var items = $scope.entity.goodsDesc.specificationItems;
        //判断items中是否有attributeName
        var object = $scope.searchObjectByKey(items, 'attributeName', specName);
        //如果存在
        if (object != null) {
            if(object.attributeValue.indexOf(optionName)>=0) return true;
            else return false;
        }
        return false;
    };
});
