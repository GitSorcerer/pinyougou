package com.pinyougou.sellergoods.service.impl;

import java.util.List;
import java.util.Map;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.pinyougou.pojo.TbBrandExample;
import entity.PageResult;
import org.springframework.beans.factory.annotation.Autowired;

import com.alibaba.dubbo.config.annotation.Service;
import com.pinyougou.mapper.TbBrandMapper;
import com.pinyougou.pojo.TbBrand;
import com.pinyougou.sellergoods.service.BrandService;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class BrandServiceImpl implements BrandService {

    @Autowired
    private TbBrandMapper brandMapper;

    @Override
    public List<TbBrand> findAll() {

        return brandMapper.selectByExample(null);
    }

    @Override
    public PageResult findPage(int pageNum, int pageSize) {
        System.out.println("===========分页查询所有===========");

//	    使用mybatis的分页工具
        PageHelper.startPage(pageNum, pageSize);
//        查询
        List<TbBrand> tbBrands1 = brandMapper.selectByExample(null);
//      将查询后的结果放入Page对象中
//        Page<TbBrand> tbBrands = (Page<TbBrand>) brandMapper.selectByExample(null);

        PageInfo<TbBrand> pageInfo = new PageInfo<>(tbBrands1);

//        返回 行数和结果（TbBrand对象）
//        return new PageResult(tbBrands.getTotal(),tbBrands.getResult());
        return new PageResult(pageInfo.getTotal(), pageInfo.getList());
    }

    @Override
    public void add(TbBrand tbBrand) {
        brandMapper.insert(tbBrand);
    }

    @Override
    public void update(TbBrand tbBrand) {
        brandMapper.updateByPrimaryKey(tbBrand);
    }

    @Override
    public TbBrand findId(Long id) {
        return brandMapper.selectByPrimaryKey(id);
    }

    @Override
    public void delete(Long ids[]) {
        for (Long id : ids) {
            brandMapper.deleteByPrimaryKey(id);
        }
    }

    @Override
    public PageResult findPage(TbBrand brand, int pageNum, int pageSize) {
        System.out.println("=============" + brand + "=============");

        PageHelper.startPage(pageNum, pageSize);
        TbBrandExample example = new TbBrandExample();
        TbBrandExample.Criteria criteria = example.createCriteria();

        if (brand != null) {
            System.out.println("brand不等于空！" + brand.getName());
            String name = brand.getName();
            String firstChar = brand.getFirstChar();

            if (name != null && !"".equals(name))
                criteria.andNameLike("%" + name + "%");
            if (firstChar != null && !"".equals(firstChar))
                criteria.andFirstCharEqualTo(firstChar);
        }

        Page<TbBrand> page = (Page<TbBrand>) brandMapper.selectByExample(example);

        return new PageResult(page.getTotal(), page.getResult());
    }

    @Override
    public List<Map> selectOptionList() {
        return brandMapper.selectOptionList();
    }

}
