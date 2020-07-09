package com.wechat.entity.vo;

import com.wechat.entity.Product;

/**
 * Created by Nelson on 2020/7/9.
 */
public class ShoppingCartVo {
    private Product product;
    private Integer number;
    private Double totalPrice;

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Integer getNumber() {
        return number;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }
}
