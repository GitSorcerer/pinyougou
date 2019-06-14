package com.pinyougou.sellergoods.service.impl;

import java.util.List;
import java.util.Map;

import com.pinyougou.mapper.TbSpecificationOptionMapper;
import com.pinyougou.pojo.TbSpecificationOption;
import com.pinyougou.pojo.TbSpecificationOptionExample;
import com.pinyougou.pojogroup.Specification;
import org.springframework.beans.factory.annotation.Autowired;
import com.alibaba.dubbo.config.annotation.Service;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.pinyougou.mapper.TbSpecificationMapper;
import com.pinyougou.pojo.TbSpecification;
import com.pinyougou.pojo.TbSpecificationExample;
import com.pinyougou.pojo.TbSpecificationExample.Criteria;
import com.pinyougou.sellergoods.service.SpecificationService;

import entity.PageResult;
import org.springframework.transaction.annotation.Transactional;

/**
 * 服务实现层
 *
 * @author Administrator
 */
@Service
@Transactional
public class SpecificationServiceImpl implements SpecificationService {

    @Autowired
    private TbSpecificationMapper specificationMapper;

    @Autowired
    private TbSpecificationOptionMapper specificationOptionMapper;

    /**
     * 查询全部
     */
    @Override
    public List<TbSpecification> findAll() {
        return specificationMapper.selectByExample(null);
    }

    /**
     * 按分页查询
     */
    @Override
    public PageResult findPage(int pageNum, int pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        Page<TbSpecification> page = (Page<TbSpecification>) specificationMapper.selectByExample(null);
        return new PageResult(page.getTotal(), page.getResult());
    }

    /**
     * 增加
     */
    @Override
    public void add(Specification specification) {

        //首先插入规格
        specificationMapper.insert(specification.getSpecification());
        //得到规格的id
        Long id = specification.getSpecification().getId();
        System.out.println("id:"+id);
        List<TbSpecificationOption> tbSpecificationOptionList = specification.getSpecificationOptionList();
        for (TbSpecificationOption specificationOption : tbSpecificationOptionList) {
            //将  规格 的id  赋给 规格选项
            specificationOption.setSpecId(id);
            //插入 规格选项
            specificationOptionMapper.insert(specificationOption);
        }



    }


    /**
     * 修改
     */
    @Override
    public void update(Specification specification) {

        specificationMapper.updateByPrimaryKey(specification.getSpecification());
//      得到规格的id
        Long id = specification.getSpecification().getId();

        TbSpecificationOptionExample  example=new TbSpecificationOptionExample();
        TbSpecificationOptionExample.Criteria criteria = example.createCriteria();
        criteria.andSpecIdEqualTo(id);
//      删除之前的规格选择
        specificationOptionMapper.deleteByExample(example);

        for (TbSpecificationOption specificationOption : specification.getSpecificationOptionList()) {
//            设置id
            specificationOption.setSpecId(id);
//            插入修改后的数据
            specificationOptionMapper.insert(specificationOption);
        }

    }

    /**
     * 根据ID获取实体
     *
     * @param id
     * @return
     */
    @Override
    public Specification findOne(Long id) {
        TbSpecification tbSpecification = specificationMapper.selectByPrimaryKey(id);
//        创建TbSpecificationOptionExample
        TbSpecificationOptionExample example=new TbSpecificationOptionExample();

//        根据TbSpecificationOptionExample对象得到Criteria
        TbSpecificationOptionExample.Criteria criteria = example.createCriteria();
//        设置查询条件
        criteria.andSpecIdEqualTo(id);
//        执行Example查询
        List<TbSpecificationOption> tbSpecificationOptions = specificationOptionMapper.selectByExample(example);

        return new Specification(tbSpecification,tbSpecificationOptions);
    }

    /**
     * 批量删除
     */
    @Override
    public void delete(Long[] ids) {
        for (Long id : ids) {
//          根据id删除specification数据    因为两表没有建立关联
//          因此可以直接删除
            specificationMapper.deleteByPrimaryKey(id);

            TbSpecificationOptionExample example=new TbSpecificationOptionExample();
            TbSpecificationOptionExample.Criteria criteria = example.createCriteria();
//          指定id
            criteria.andSpecIdEqualTo(id);
//          删除
            specificationOptionMapper.deleteByExample(example);
        }
    }


    @Override
    public PageResult findPage(TbSpecification specification, int pageNum, int pageSize) {
        PageHelper.startPage(pageNum, pageSize);

        TbSpecificationExample example = new TbSpecificationExample();
        Criteria criteria = example.createCriteria();

        if (specification != null) {
            if (specification.getSpecName() != null && specification.getSpecName().length() > 0) {
                criteria.andSpecNameLike("%" + specification.getSpecName() + "%");
            }

        }

        Page<TbSpecification> page = (Page<TbSpecification>) specificationMapper.selectByExample(example);
        return new PageResult(page.getTotal(), page.getResult());
    }

    @Override
    public List<Map> selectOptionList() {
        return specificationMapper.selectOptionList();
    }


}
