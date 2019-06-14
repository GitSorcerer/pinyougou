app.service('uploadService', function ($http) {
    this.uploadFile = function () {
        var formdata = new FormData();
        formdata.append('file', file.files[0]);//name为file的第一个文件
        // alert(file.files[0].name);
        return $http({
            url: '../uploadFile/upload.do',
            method: 'post',
            data: formdata,
            // headers: {'Content-Type': 'multipart/form-data'},
            headers: {'Content-Type': undefined},//表明提交的是文件（而不是json格式数据）
            transformRequest: angular.identity
        });
    };
});