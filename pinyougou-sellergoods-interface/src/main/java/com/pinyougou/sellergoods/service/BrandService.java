package com.pinyougou.sellergoods.service;

import java.util.List;
import java.util.Map;

import com.pinyougou.pojo.TbBrand;
import entity.PageResult;

/**
 * 品牌接口
 *
 * @author Administrator
 */
public interface BrandService {

    List<TbBrand> findAll();

    //分页
    PageResult findPage(int pageNum, int pageSize);

    //添加
    void add(TbBrand tbBrand);

    //	修改
    void update(TbBrand tbBrand);

    //	根据Id查询
    TbBrand findId(Long id);

    //	删除
    void delete(Long ids[]);

    //	模糊查询
    PageResult findPage(TbBrand brand, int pageNum, int pageSize);


    List<Map> selectOptionList();
}
