package com.pinyougou.service;

import com.pinyougou.pojo.TbSeller;
import com.pinyougou.sellergoods.service.SellerService;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.ArrayList;
import java.util.List;

/**
 * 认证管理
 */
public class UserDetailServiceImpl implements UserDetailsService {

    private SellerService sellerService;

    //    提供set方法
    public void setSellerService(SellerService sellerService) {
        this.sellerService = sellerService;
    }

    @Override
    public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
        System.out.println("================" + s + "================");
        List<GrantedAuthority> grantedAuthorities = new ArrayList<>();
        grantedAuthorities.add(new SimpleGrantedAuthority("ROLE_SELLER"));

        TbSeller seller = sellerService.findOne(s);
        System.out.println(seller.getPassword()+"=========="+seller.getStatus());

//       如果商家不为空 并且 已经审核  则可以登录
        if (seller != null && "1".equals(seller.getStatus()))
            return new User(s, seller.getPassword(), grantedAuthorities);

/*        if(seller!=null){
            if()
        }*/
        return null;
//        return new User(s, "123456", grantedAuthorities);
    }
}
