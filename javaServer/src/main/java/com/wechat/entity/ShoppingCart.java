package com.wechat.entity;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by Nelson on 2020/7/7.
 */
@Entity
@Table(name = "shoppingcart")
public class ShoppingCart {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Integer id;
    private String openId;
    private Integer productId;
    private Date createDate;
    private Integer number;
    private String productName;
    private double price;
    private double priceTotal;
    private Integer payed;
    private String productImageSrc;
    @Transient
    private boolean checked;

    public String getProductImageSrc() {
        return productImageSrc;
    }

    public void setProductImageSrc(String productImageSrc) {
        this.productImageSrc = productImageSrc;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getOpenId() {
        return openId;
    }

    public void setOpenId(String openId) {
        this.openId = openId;
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public Integer getNumber() {
        return number;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public double getPriceTotal() {
        return priceTotal;
    }

    public void setPriceTotal(double priceTotal) {
        this.priceTotal = priceTotal;
    }

    public Integer getPayed() {
        return payed;
    }

    public void setPayed(Integer payed) {
        this.payed = payed;
    }

    public boolean isChecked() {
        return checked;
    }

    public void setChecked(boolean checked) {
        this.checked = checked;
    }
}
