package com.pinyougou.shop.controller;


import com.pinyougou.until.FastDFSClient;
import entity.Result;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/uploadFile")
public class UploadFileController {


    //   注入配置文件中的值
    @Value("${FILE_SERVER_URL}")
    private String file_server_url;//服务器地址

    //    @RequestMapping(value = "/upload.do",headers = "content-type=multipart/*", method = RequestMethod.POST)
//    public Result upload(@RequestParam("file") MultipartFile file){
    @RequestMapping("/upload.do")
    public Result upload(MultipartFile file) {

        //得到文件名
        String filename = file.getOriginalFilename();

        System.out.println(filename);
//        得到文件后缀名
        String name = filename.substring(filename.lastIndexOf(".") + 1);

        try {
            FastDFSClient dfsClient = new FastDFSClient("classpath:config/fdfs_client.conf");
//            上传图片  得到图片的路劲
            String url = dfsClient.uploadFile(file.getBytes(), name);
//            将服务器的地址与返回图片的路径拼接就是  图片的完整路径
            url = file_server_url + url;
            System.out.println("url:" + url);
            return new Result(true, url);

        } catch (Exception e) {
            e.printStackTrace();
            return new Result(false, "上传失败！");
        }

    }

}
