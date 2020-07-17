package com.wechat.resource;

import com.wechat.base.BaseResource;
import com.wechat.base.Result;
import com.wechat.base.ResultType;
import com.wechat.entity.ShoppingCart;
import com.wechat.entity.User;
import com.wechat.entity.vo.PostDataVo;
import com.wechat.service.IShoppingCart;
import com.wechat.service.IUser;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.persistence.criteria.CriteriaBuilder;
import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

/**
 * Created by Nelson on 2020/7/10.
 */
@RestController
@RequestMapping(value ="/shoppingCart")
public class ShoppingCartResource extends BaseResource {
    private final IShoppingCart shoppingCartService;
    private final IUser userService;

    /**
     * 使用IDE 推荐的构造依赖注入
     * @param
     * @param userService
     */
    public ShoppingCartResource(IShoppingCart shoppingCartService, IUser userService) {
        this.shoppingCartService = shoppingCartService;
        this.userService = userService;
    }

    @RequestMapping(value = "/shoppingCartList",method = RequestMethod.POST)
    public Result FindShoppingCartListWithUser(@RequestBody PostDataVo vo, HttpServletRequest request){
        if(StringUtils.isEmpty(vo.getToken())){
            return this.GenerateResult(ResultType.AccessNeeded);
        }
        User user=userService.findByToken(vo.getToken());
        if(user==null){
            return this.GenerateResult(ResultType.AccessDenied);
        }
        List<ShoppingCart> list=shoppingCartService.findListWithUser(user.getOpenId());
        Result result=new Result();
        result.setData(list);
        return result;
    }

    @RequestMapping(value = "/deleteShoppingCart",method = RequestMethod.POST)
    public Result DeleteShoppingCartItem(@RequestBody PostDataVo vo,HttpServletRequest request){
        if(StringUtils.isEmpty(vo.getToken())){
            return this.GenerateResult(ResultType.AccessNeeded);
        }
        User user=userService.findByToken(vo.getToken());
        if(user==null){
            return this.GenerateResult(ResultType.AccessDenied);
        }
        Result result=new Result();
        try {
            Map<String,String> map=vo.ConvertDataToObject(Map.class);
            Integer id=Integer.parseInt(map.get("id"));
            shoppingCartService.deleteShoppingCart(id);
            return result;
        }catch (Exception ex){
            return this.GenerateResult(ResultType.ExceptionCatched,ex.getMessage());
        }
    }
}
