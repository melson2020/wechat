package com.wechat.dao;

import com.wechat.entity.ShoppingCart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by Nelson on 2020/7/8.
 */
@Repository
public interface IShoppingCartDao extends JpaRepository<ShoppingCart,String> {
}
