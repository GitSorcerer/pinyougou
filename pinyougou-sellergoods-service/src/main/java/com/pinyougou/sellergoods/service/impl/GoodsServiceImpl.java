package com.pinyougou.sellergoods.service.impl;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSON;
import com.pinyougou.mapper.*;
import com.pinyougou.pojo.*;
import com.pinyougou.pojogroup.Goods;
import org.springframework.beans.factory.annotation.Autowired;
import com.alibaba.dubbo.config.annotation.Service;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.pinyougou.pojo.TbGoodsExample.Criteria;
import com.pinyougou.sellergoods.service.GoodsService;

import entity.PageResult;
import org.springframework.transaction.annotation.Transactional;

/**
 * 服务实现层
 *
 * @author Administrator
 */
@Service
@Transactional
public class GoodsServiceImpl implements GoodsService {

    @Autowired
    private TbGoodsMapper goodsMapper;

    @Autowired
    private TbGoodsDescMapper goodsDescMapper;

    @Autowired
    private TbItemMapper itemMapper;

    @Autowired
    private TbBrandMapper brandMapper;

    @Autowired
    private TbItemCatMapper itemCatMapper;

    @Autowired
    private TbSellerMapper sellerMapper;



    /**
     * 查询全部
     */
    @Override
    public List<TbGoods> findAll() {
        return goodsMapper.selectByExample(null);
    }

    /**
     * 按分页查询
     */
    @Override
    public PageResult findPage(int pageNum, int pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        Page<TbGoods> page = (Page<TbGoods>) goodsMapper.selectByExample(null);
        return new PageResult(page.getTotal(), page.getResult());
    }

    /**
     * 增加
     */
    @Override
    public void add(Goods goods) {
        TbGoods tbGoods = goods.getGoods();
//        设置状态值为0
        tbGoods.setAuditStatus("0");

        goodsMapper.insert(tbGoods);
//       设置id
        goods.getGoodsDesc().setGoodsId(tbGoods.getId());

        goodsDescMapper.insert(goods.getGoodsDesc());

        saveItemList(goods);

    }
//    保存的方法
    private void saveItemList(Goods goods){
        TbGoods tbGoods = goods.getGoods();
        //        启用规格
        if ("1".equals(tbGoods.getIsEnableSpec())) {
            for (TbItem item : goods.getItemList()) {
//            标题
                String title = goods.getGoods().getGoodsName();

                Map<String, Object> specMap = JSON.parseObject(item.getSpec());

                for (String key : specMap.keySet())
                    title+=" "+specMap.get(key);

//            设置标题
                item.setTitle(title);
//            设置商家id
                setItemVal( item, tbGoods, goods);

                itemMapper.insert(item);
            }
        }else {

            TbItem item = new TbItem();

            item.setTitle(tbGoods.getGoodsName());

            item.setPrice(tbGoods.getPrice());

//           因为没有开启规格  所以 设置默认值
            item.setStatus("1");

            item.setIsDefault("1");

            item.setNum(1000000);

//           设置基本属性
            setItemVal( item, tbGoods, goods);

            itemMapper.insert(item);
        }




    }

//    设置规格
    private void setItemVal(TbItem item,TbGoods tbGoods,Goods goods){
        item.setGoodsId(tbGoods.getId());

//            设置商家编号
        item.setSellerId(tbGoods.getSellerId());

        item.setCategoryid(tbGoods.getCategory3Id());

        item.setCreateTime(new Date());

        item.setUpdateTime(new Date());

//            品牌名称
        TbBrand brand = brandMapper.selectByPrimaryKey(tbGoods.getBrandId());
        item.setBrand(brand.getName());

//            分类名称
        TbItemCat itemCat = itemCatMapper.selectByPrimaryKey(tbGoods.getCategory3Id());
        item.setCategory(itemCat.getName());

//            商家名称
        System.out.println("tbGoods.getSellerId:"+tbGoods.getSellerId());
        TbSeller seller = sellerMapper.selectByPrimaryKey(tbGoods.getSellerId());
        System.out.println("商家："+seller);
        item.setSeller(seller.getNickName());

//            图片地址
        List<Map> imgeList = JSON.parseArray(goods.getGoodsDesc().getItemImages(), Map.class);

        if (imgeList.size() > 0)
            item.setImage((String) imgeList.get(0).get("url"));
    }


    /**
     * 修改
     */
    @Override
    public void update(Goods goods) {
//        goodsMapper.updateByPrimaryKey(goods);
        // 修改后的商品需要重新设置状态
        goods.getGoods().setAuditStatus("0");

//        修改商品
        goodsMapper.updateByPrimaryKey(goods.getGoods());
//        修改扩展属性
        goodsDescMapper.updateByPrimaryKey(goods.getGoodsDesc());

        TbItemExample example=new TbItemExample();
        TbItemExample.Criteria criteria = example.createCriteria();
        criteria.andGoodsIdEqualTo(goods.getGoods().getId());
//        首先是删除
        itemMapper.deleteByExample(example);
//        然后添加
        saveItemList(goods);

    }

    /**
     * 根据ID获取实体
     *
     * @param id
     * @return
     */
    @Override
    public Goods findOne(Long id) {

//        查询基本信息
        TbGoods tbGoods = goodsMapper.selectByPrimaryKey(id);
        System.out.println("tbGoods:"+tbGoods);

//       查询扩展属性
        TbGoodsDesc tbGoodsDesc = goodsDescMapper.selectByPrimaryKey(id);
        Goods goods = new Goods();

        goods.setGoods(tbGoods);
        goods.setGoodsDesc(tbGoodsDesc);

//        查询规格
        TbItemExample example=new TbItemExample();
        TbItemExample.Criteria criteria = example.createCriteria();
        criteria.andGoodsIdEqualTo(id);
        List<TbItem> tbItems = itemMapper.selectByExample(example);

        goods.setItemList(tbItems);

        return  goods;
    }

    /**
     * 批量删除
     */
    @Override
    public void delete(Long[] ids) {
        for (Long id : ids) {
            goodsMapper.deleteByPrimaryKey(id);
        }
    }

    //查询
    @Override
    public PageResult findPage(TbGoods goods, int pageNum, int pageSize) {
        PageHelper.startPage(pageNum, pageSize);

        TbGoodsExample example = new TbGoodsExample();
        Criteria criteria = example.createCriteria();

        if (goods != null) {
//            按照指定的商家查询
            if (goods.getSellerId() != null && goods.getSellerId().length() > 0) {
//                criteria.andSellerIdLike("%" + goods.getSellerId() + "%");
                criteria.andSellerIdEqualTo(goods.getSellerId());
            }
            if (goods.getGoodsName() != null && goods.getGoodsName().length() > 0) {
                criteria.andGoodsNameLike("%" + goods.getGoodsName() + "%");
            }
            if (goods.getAuditStatus() != null && goods.getAuditStatus().length() > 0) {
                criteria.andAuditStatusLike("%" + goods.getAuditStatus() + "%");
            }
            if (goods.getIsMarketable() != null && goods.getIsMarketable().length() > 0) {
                criteria.andIsMarketableLike("%" + goods.getIsMarketable() + "%");
            }
            if (goods.getCaption() != null && goods.getCaption().length() > 0) {
                criteria.andCaptionLike("%" + goods.getCaption() + "%");
            }
            if (goods.getSmallPic() != null && goods.getSmallPic().length() > 0) {
                criteria.andSmallPicLike("%" + goods.getSmallPic() + "%");
            }
            if (goods.getIsEnableSpec() != null && goods.getIsEnableSpec().length() > 0) {
                criteria.andIsEnableSpecLike("%" + goods.getIsEnableSpec() + "%");
            }
            if (goods.getIsDelete() != null && goods.getIsDelete().length() > 0) {
                criteria.andIsDeleteLike("%" + goods.getIsDelete() + "%");
            }

        }

        Page<TbGoods> page = (Page<TbGoods>) goodsMapper.selectByExample(example);
        return new PageResult(page.getTotal(), page.getResult());
    }

    /**
     * 修改状态
     * @param ids
     * @param status
     */
    @Override
    public void updateStatus(Long ids[], String status) {
        for (Long id : ids) {
//            首先根据id查询值
            TbGoods tbGoods = goodsMapper.selectByPrimaryKey(id);
//            然后根据id修改状态
            tbGoods.setAuditStatus(status);
//            更新修改后的状态
            goodsMapper.updateByPrimaryKey(tbGoods);
        }

    }

    @Override
    public List<TbItem> findItemListByGoodsIdAndStatus(Long[] goodsIds, String status) {
        System.out.println(goodsIds[0]+"   "+status);
        TbItemExample example = new TbItemExample();
        TbItemExample.Criteria criteria = example.createCriteria();
        criteria.andStatusEqualTo(status);
        criteria.andGoodsIdIn(Arrays.asList(goodsIds));
        List<TbItem> tbItems = itemMapper.selectByExample(example);
        System.out.println("JSON:" + JSON.toJSONString(tbItems));
        return tbItems;
    }

}
