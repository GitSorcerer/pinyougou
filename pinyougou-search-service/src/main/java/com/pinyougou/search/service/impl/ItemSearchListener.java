package com.pinyougou.search.service.impl;

import com.alibaba.fastjson.JSON;
import com.pinyougou.pojo.TbItem;
import com.pinyougou.search.service.ItemSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.TextMessage;
import java.util.List;
import java.util.Map;

@Component
public class ItemSearchListener implements MessageListener {
    @Autowired
    private ItemSearchService itemSearchService;

    @Override
    public void onMessage(Message message) {
        TextMessage textMessage = (TextMessage) message;
        try {
            String text = textMessage.getText();
            System.out.println("消息："+text);

            List<TbItem> tbItems = JSON.parseArray(text, TbItem.class);
            for (TbItem item : tbItems) {
                System.out.println(item.getId() + "  " + item.getTitle());
                Map spec = JSON.parseObject(item.getSpec());
                item.setSpecMap(spec);
            }
            itemSearchService.importList(tbItems);
            System.out.println("成功导入！");

        } catch (JMSException e) {
            e.printStackTrace();
        }
    }
}
