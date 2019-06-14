package com.pinyougou.manager.controller;

import java.util.List;
import java.util.Map;

import entity.PageResult;
import entity.Result;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.dubbo.config.annotation.Reference;
import com.pinyougou.pojo.TbBrand;
import com.pinyougou.sellergoods.service.BrandService;

@RestController
@RequestMapping("/brand")
public class BrandController {

    @Reference
    private BrandService brandService;

    //	查询所有品牌
    @RequestMapping("/findAll.do")
    public List<TbBrand> findAll() {
        System.out.println("================findAll.do================");
        return brandService.findAll();
    }

    //	分页显示查询品牌
    @RequestMapping("/findPage.do")
    public PageResult findPage(int page, int size) {
        System.out.println("======分页查询品牌======");

        return brandService.findPage(page, size);
    }

    //	添加品牌
    @RequestMapping("/add.do")
    public Result add(@RequestBody TbBrand tbBrand) {
        System.out.println("================进入添加================");
        try {
            brandService.add(tbBrand);
            return new Result(true, "添加成功！");
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(false, "添加失败！");
        }
    }

    //	根据Id查询
    @RequestMapping("/findId.do")
    public TbBrand findId(Long id) {
        System.out.println("================根据Id查询================");


        return brandService.findId(id);
    }

    //	修改
    @RequestMapping("/update.do")
    public Result update(@RequestBody TbBrand tbBrand) {
        System.out.println("==========修改==========");
        try {
            brandService.update(tbBrand);

            return new Result(true, "修改成功！");
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(false, "修改失败！");
        }
    }

    //	删除
    @RequestMapping("/delete.do")
    public Result delete(Long ids[]) {
        System.out.println("==============删除==============");
        try {
            brandService.delete(ids);
            return new Result(true, "删除成功！");
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(false, "删除失败！");
        }
    }


    //	模糊查询
    @RequestMapping("/search.do")
    public PageResult search(@RequestBody TbBrand tbBrand, int page, int size) {
        System.out.println("================模糊查询================");
/*        if (tbBrand != null)
            System.out.println(tbBrand.getName() + "====" + tbBrand.getFirstChar());

        System.out.println("page:" + page + "    size:" + size);*/

        PageResult pagaresult = brandService.findPage(tbBrand, page, size);
        return pagaresult;

    }
    @RequestMapping("/selectOptionList.do")
    public List<Map> selectOptionList(){
        return brandService.selectOptionList();
    }

}
