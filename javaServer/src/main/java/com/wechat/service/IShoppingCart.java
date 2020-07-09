package com.wechat.service;

import com.wechat.base.IService;
import com.wechat.entity.Product;
import com.wechat.entity.ShoppingCart;
import com.wechat.entity.User;

/**
 * Created by Nelson on 2020/7/8.
 */
public interface IShoppingCart extends IService<ShoppingCart> {
    ShoppingCart saveShoppingCart(Product product, User user,Integer number, Double totalPrice);
}
