package com.pinyougou.search.service;

import java.util.List;
import java.util.Map;

public interface ItemSearchService {
    /**
     * 搜索
     * @param seachMap
     * @return
     */
    Map<String,Object> seach(Map seachMap);

    /**
     * 导入数据
     * @param list
     */
    void importList(List list);

    /**
     * 删除solr中的数据
     * @param goodsIdList
     */
    void deleteByGoodsIds(List goodsIdList);
}
