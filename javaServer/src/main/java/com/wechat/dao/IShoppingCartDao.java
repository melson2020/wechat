package com.wechat.dao;

import com.wechat.entity.ShoppingCart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by Nelson on 2020/7/8.
 */
@Repository
public interface IShoppingCartDao extends JpaRepository<ShoppingCart,String> {
    List<ShoppingCart> findAllByOpenId(String id);
    @Transactional
    @Modifying
    @Query(nativeQuery = true, value ="Delete FROM ShoppingCart where id=?1")
    void deleteWithId(Integer id);
}
