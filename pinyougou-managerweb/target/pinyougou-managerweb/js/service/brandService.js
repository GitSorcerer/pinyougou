//前端的service层
app.service('brandService', function ($http) {

    this.findAll = function () {
        return $http.get('../brand/findAll.do');
    };
    this.findPage = function (page, rows) {
        return $http.get('../brand/findPage.do?page=' + page + '&size=' + rows);
    };

    this.add = function (entity) {
        return $http.post('../brand/add.do', entity);
    };
    this.update = function (entity) {
        return $http.post('../brand/update.do', entity);
    };
    this.findId = function (id) {
        return $http.get('../brand/findId.do?id=' + id);
    };
    this.delete = function (ids) {

        return $http.get('../brand/delete.do?ids=' + ids);
    };
    this.search = function (page, size, entity) {
        return $http.post('../brand/search.do?page=' + page + '&size=' + size, entity);
    };

    this.selectOptionList=function () {
        return $http.get('../brand/selectOptionList.do');
    }
});