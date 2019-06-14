package com.pinyougou.cart.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.fastjson.JSON;
import com.pinyougou.cart.service.CartService;
import com.pinyougou.pojogroup.Cart;
import com.pinyougou.until.CookieUtil;
import entity.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {

    @Reference
    private CartService cartService;


    @Autowired
    private HttpServletRequest request;

    @Autowired
    private HttpServletResponse response;


    /**
     * 购物车列表
     * @return
     */
    @RequestMapping("/findCartList")
    public List<Cart> findCartList(){

        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("用户名："+name);
        String cartListString = CookieUtil.getCookieValue(request, "cartList","UTF-8");

        if(cartListString==null || cartListString.equals("")){
            cartListString="[]";
        }
        List<Cart> cartList_cookie = JSON.parseArray(cartListString, Cart.class);
//        用户不存在
        if ("anonymousUser".equals(name)) {
            System.out.println("从Cookie取！");
            return cartList_cookie;
        }else {//用户存在 就从redis中取
            System.out.println("从redis取！");
            List<Cart> cartList_Redis = cartService.findCartListFromRedis(name);

            if (cartList_cookie.size() > 0) {//cookie中有数据
                //合并购物车
                cartList_Redis = cartService.mergeCartList(cartList_Redis, cartList_cookie);
//                清除cookie
                CookieUtil.deleteCookie(request, response, "cartList");
                //将数据放入redis中
                cartService.saveCartListToRedis(name, cartList_Redis);
            }
            return cartList_Redis;
        }
//        return cartList;
    }

    /**
     * 添加商品到购物车
     * @param itemId
     * @param num
     * @return
     */
    @RequestMapping("/addGoodsToCartList")
    @CrossOrigin(origins ="http://localhost:9105")//允许跨域 携带头信息 和 cookie
    public Result addGoodsToCartList(Long itemId, Integer num){
        try {
            String name = SecurityContextHolder.getContext().getAuthentication().getName();

            List<Cart> cartList =findCartList();//获取购物车列表
            cartList = cartService.addGoodsToCartList(cartList, itemId, num);
            if ("anonymousUser".equals(name)) {
                CookieUtil.setCookie(request, response, "cartList", JSON.toJSONString(cartList), 3600 * 24, "UTF-8");
                System.out.println("将数据存入Cookie！");
            } else {
                cartService.saveCartListToRedis(name, cartList);
                System.out.println("将数据存入redis中！");
            }
            return new Result(true, "添加成功");
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(false, "添加失败");
        }
    }
}



