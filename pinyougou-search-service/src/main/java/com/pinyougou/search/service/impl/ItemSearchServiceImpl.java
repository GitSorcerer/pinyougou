package com.pinyougou.search.service.impl;

import com.alibaba.dubbo.config.annotation.Service;
import com.pinyougou.pojo.TbItem;
import com.pinyougou.search.service.ItemSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.solr.core.SolrTemplate;
import org.springframework.data.solr.core.query.*;
import org.springframework.data.solr.core.query.result.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service(timeout = 5000)//设置超时时间
public class ItemSearchServiceImpl implements ItemSearchService {

    @Autowired
    private RedisTemplate redisTemplate;
    @Autowired
    private SolrTemplate solrTemplate;

    @Override
    public Map<String, Object> seach(Map seachMap) {
        Map<String, Object> map = new HashMap<>();

       /* SimpleQuery query = new SimpleQuery();
        Criteria criteria = new Criteria("item_keywords").is(seachMap.get("keywords"));
        query.addCriteria(criteria);

        ScoredPage<TbItem> tbItems = solrTemplate.queryForPage(query, TbItem.class);*/

        HighlightQuery query = new SimpleHighlightQuery();
//        设置高亮域为标题
        HighlightOptions highlightOptions = new HighlightOptions().addField("item_title");

        highlightOptions.setSimplePrefix("<em style='color:red'>");
        highlightOptions.setSimplePostfix("</em>");

        query.setHighlightOptions(highlightOptions);

        //按照关键字查询
        //关键字空格处理
        String keywords = (String) seachMap.get("keywords");
        seachMap.put("keywords", keywords.replace(" ", ""));

        Criteria criteria = new Criteria("item_keywords").is(seachMap.get("keywords"));

        query.addCriteria(criteria);

//        过滤查询  设置条件查询
//        按照类型查询
        if (!"".equals(seachMap.get("category"))) {
            Criteria filterCriteria = new Criteria("item_category").is(seachMap.get("category"));
            FilterQuery filterQuery = new SimpleFacetQuery(filterCriteria);
            query.addFilterQuery(filterQuery);
        }

//        按照品牌查询
        if (!"".equals(seachMap.get("brand"))) {
            Criteria filterCriteria = new Criteria("item_brand").is(seachMap.get("brand"));
            FilterQuery filterQuery = new SimpleFacetQuery(filterCriteria);
            query.addFilterQuery(filterQuery);
        }

//      规格查询
        if (seachMap.get("spec") != null) {
            Map<String, String> specMap = (Map<String, String>) seachMap.get("spec");
            for (String key : specMap.keySet()) {
                Criteria filterCriteria = new Criteria("item_spec_" + key).is(specMap.get(key));
                FilterQuery filterQuery = new SimpleFacetQuery(filterCriteria);
                query.addFilterQuery(filterQuery);
            }
        }


//        按价格查询
//        System.out.println("searchMap:"+seachMap.get("price"));
//        if (!"".equals(seachMap.get("price"))) {
        if ( seachMap.get("price")!=null && !"".equals(seachMap.get("price"))) {
            String str= (String) seachMap.get("price");
//            System.out.println(str);
            String[] split = str.split("-");
//            如果第一个不为0
            if (!"0".equals(split[0])) {
//                大于等于
                Criteria filterCriteria = new Criteria("item_price").greaterThanEqual(split[0]);
                FilterQuery filterQuery=new SimpleFilterQuery(filterCriteria);
                query.addFilterQuery(filterQuery);
            }
            if (!"*".equals(split[1])) {
//                小于等于
                Criteria filterCriteria = new Criteria("item_price").lessThanEqual(split[1]);
                FilterQuery filterQuery=new SimpleFilterQuery(filterCriteria);
                query.addFilterQuery(filterQuery);
            }
        }

//        分页
//        当前页
        Integer pageNo = (Integer) seachMap.get("pageNo");
        pageNo = pageNo == null ? 1 : pageNo;
//        每页记录数
        Integer pageSize = (Integer) seachMap.get("pageSize");
        pageSize = pageSize == null ? 20 : pageSize;

        query.setOffset((pageNo - 1) * pageSize);//从第几条数据开始查询
        query.setRows(pageSize);//每页显示的条数


        String sortVal = (String) seachMap.get("sort");//DESC ASC
        String sortField = (String) seachMap.get("sortField");//排序的字段

        if (sortVal != null && sortField != null) {
            if ("ASC".equals(sortVal)) {
                Sort sort = new Sort(Sort.Direction.ASC, "item_" + sortField);
                query.addSort(sort);
            }
            if ("DESC".equals(sortVal)) {
                Sort sort = new Sort(Sort.Direction.DESC, "item_" + sortField);
                query.addSort(sort);
            }
        }



        HighlightPage<TbItem> page = solrTemplate.queryForHighlightPage(query, TbItem.class);

        for(HighlightEntry<TbItem> h: page.getHighlighted()){//循环高亮入口集合
            TbItem item = h.getEntity();//获取原实体类
            if(h.getHighlights().size()>0 && h.getHighlights().get(0).getSnipplets().size()>0){
                item.setTitle(h.getHighlights().get(0).getSnipplets().get(0));//设置高亮的结果
            }

        }
        map.put("rows", page.getContent());

//        根据关键字查询商品分类
        List<String> list = seachCategoryList(seachMap);
        map.put("categoryList", list);

//       查询规格和规格列表
        String categoryName = (String) seachMap.get("category");
        if (!"".equals(categoryName)) {
            map.putAll(searchBrandAndSpecList(categoryName));
        }else {
            if(list.size()>0)
                map.putAll(searchBrandAndSpecList(list.get(0)));
        }

        map.put("totalPages", page.getTotalPages());//返回的总页数
        map.put("total", page.getTotalElements());//返回的总记录数


        return map;
    }

    @Override
    public void importList(List list) {
        solrTemplate.saveBeans(list);
        solrTemplate.commit();
    }

    /**
     * 删除
     * @param goodsIdList
     */
    @Override
    public void deleteByGoodsIds(List goodsIdList) {
        SimpleQuery query = new SimpleQuery();
        Criteria criteria=new Criteria("item_goodsid").in(goodsIdList);
        query.addCriteria(criteria);
        solrTemplate.delete(query);
        solrTemplate.commit();
    }

    private List<String> seachCategoryList(Map searchMap) {
        List<String> list = new ArrayList<>();

        SimpleQuery query = new SimpleQuery();
//        创建一个criteria对象  复制域     keywords查询的条件
        Criteria criteria = new Criteria("item_keywords").is(searchMap.get("keywords"));

        query.addCriteria(criteria);

        //设置分组选项
        GroupOptions groupOptions=new GroupOptions().addGroupByField("item_category");
        query.setGroupOptions(groupOptions);
        //得到分组页
        GroupPage<TbItem> page = solrTemplate.queryForGroupPage(query, TbItem.class);
        //根据列得到分组结果集
        GroupResult<TbItem> groupResult = page.getGroupResult("item_category");
        //得到分组结果入口页
        Page<GroupEntry<TbItem>> groupEntries = groupResult.getGroupEntries();
        //得到分组入口集合
        List<GroupEntry<TbItem>> content = groupEntries.getContent();
        for(GroupEntry<TbItem> entry:content){
            list.add(entry.getGroupValue());//将分组结果的名称封装到返回值中
        }
        return list;
    }

    private Map searchBrandAndSpecList(String category) {
        Map map = new HashMap();

        Long typeId = (Long) redisTemplate.boundHashOps("itemCat").get(category);

//        读入缓存
        if (typeId != null) {
            //根据模板ID查询品牌列表
            List brandList = (List) redisTemplate.boundHashOps("brandList").get(typeId);
            map.put("brandList", brandList);///返回值添加品牌列表
            //根据模板ID查询规格列表
            List specList = (List) redisTemplate.boundHashOps("specList").get(typeId);
            map.put("specList", specList);
        }
        return map;
    }


}
