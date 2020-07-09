package com.wechat.service.impl;

import com.wechat.base.AbstractService;
import com.wechat.dao.IShoppingCartDao;
import com.wechat.entity.Product;
import com.wechat.entity.ShoppingCart;
import com.wechat.entity.User;
import com.wechat.service.IShoppingCart;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.Date;

/**
 * Created by Nelson on 2020/7/8.
 */
@Service
public class ShoppingCartImpl extends AbstractService<ShoppingCart> implements IShoppingCart {
    @Autowired
    private IShoppingCartDao shoppingCartDao;
    @Override
    public JpaRepository<ShoppingCart, String> getRepository() {
        return shoppingCartDao;
    }

    @Override
    public ShoppingCart saveShoppingCart(Product product, User user, Integer number, Double totalPrice) {
        ShoppingCart shoppingCart=new ShoppingCart();
        shoppingCart.setCreateDate(new Date());
        shoppingCart.setNumber(number);
        shoppingCart.setOpenId(user.getOpenId());
        shoppingCart.setPayed(0);
        shoppingCart.setPrice(product.getPrice());
        shoppingCart.setPriceTotal(totalPrice);
        shoppingCart.setProductId(product.getId());
        shoppingCart.setProductName(product.getName());
        return shoppingCartDao.save(shoppingCart);
    }
}
