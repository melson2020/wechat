package com.wechat.resource;

import com.wechat.base.BaseResource;
import com.wechat.base.ResultType;
import com.wechat.base.Result;
import com.wechat.entity.Product;
import com.wechat.entity.ShoppingCart;
import com.wechat.entity.User;
import com.wechat.entity.vo.PostDataVo;
import com.wechat.entity.vo.ShoppingCartVo;
import com.wechat.service.IProduct;
import com.wechat.service.IShoppingCart;
import com.wechat.service.IUser;
import com.wechat.utils.JsonToObjectUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.persistence.Transient;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by Messi on 2020/7/1.
 */

@RestController
@RequestMapping("/product")
public class ProductResource extends BaseResource {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    @Autowired
    private IProduct productService;
    @Autowired
    private IUser userService;
    @Autowired
    private IShoppingCart shoppingCartService;
    @Value("${spring.Host.hostName}")
    private String baseHost;


    @RequestMapping(method = RequestMethod.GET, value = "/allProductList")
    public Result getAllProductList(HttpServletResponse response) {
        if (logger.isDebugEnabled()) {
            logger.debug("Rest Call: /product/allProductList ...");
        }
        long t1 = new Date().getTime();
        List<Product> productList = productService.QueryAll();
        List<Product> products=new ArrayList<>();
        for(Product p:productList){
            p.setHost(baseHost);
            products.add(p);
        }
        Result result = new Result(products);
        long t2 = new Date().getTime();
        System.out.println("GET Rest Call: /product/allProductList ..." + (t2 - t1));
        return result;
    }


    @RequestMapping(method = RequestMethod.GET, value = "/recommendList")
    public Result getRecommendProductList(HttpServletResponse response) {
        if (logger.isDebugEnabled()) {
            logger.debug("Rest Call: /product/recommendList ...");
        }
        long t1 = new Date().getTime();
        List<Product> productList = productService.FindByRecommend();
        List<Product> products=new ArrayList<>();
        for(Product p:productList){
            p.setHost(baseHost);
            products.add(p);
        }
        Result result = new Result(products);
        long t2 = new Date().getTime();
        System.out.println("GET Rest Call: /product/recommendList ..." + (t2 - t1));
        return result;
    }

    @RequestMapping(value = "/saveShoppingCart", method = RequestMethod.POST)
    public Result saveShoppingCart(@RequestBody PostDataVo vo, HttpServletRequest request) {
        String token = vo.getToken();
        if (StringUtils.isEmpty(token)) {
            return this.GenerateResult(ResultType.AccessNeeded);
        }
        User user = userService.findByToken(vo.getToken());
        if(user==null){
            return this.GenerateResult(ResultType.AccessDenied);
        }
        try {
            Result result=new Result();
            ShoppingCartVo cartVo =vo.ConvertDataToObject(ShoppingCartVo.class);
            ShoppingCart cart=shoppingCartService.saveShoppingCart(cartVo.getProduct(),user,cartVo.getNumber(),cartVo.getTotalPrice());
            if(cart==null){
                result.setResultStatus(-1);
            }
            return result;
        }catch (Exception ex){
            return this.GenerateResult(ResultType.ExceptionCatched,ex.getMessage());
        }
    }
}
