package com.alidayu;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.core.JmsMessagingTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class QueueController {

    @Autowired
    private JmsMessagingTemplate jmsMessagingTemplate;

    @RequestMapping("/sendsms")
    public void sendSms() {
        Map map = new HashMap<>();
        map.put("mobile", "15871268712");
        map.put("template_code", "SMS_142383476");
        map.put("sign_name", "高建成");
        map.put("param", "{\"code\":\"123456\"}");
        jmsMessagingTemplate.convertAndSend("sms", map);

    }

}
