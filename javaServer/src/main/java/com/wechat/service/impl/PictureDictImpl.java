package com.wechat.service.impl;

import com.wechat.base.AbstractService;
import com.wechat.dao.IPictureDictDao;
import com.wechat.entity.PictureDict;
import com.wechat.service.IPictureDict;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.Date;
import java.util.List;

/**
 * Created by Nelson on 2020/6/25.
 */
@Service
public class PictureDictImpl extends AbstractService<PictureDict> implements IPictureDict {
    @Autowired
    private IPictureDictDao pictureDictDao;
    @Value("${spring.Host.hostName}")
    private String baseHost;
    @Value("${spring.Host.realPath}")
    private String realPath;
    @Override
    public JpaRepository<PictureDict, String> getRepository() {
        return pictureDictDao;
    }


    @Override
    public List<PictureDict> findPictures(String openId) {
        List<PictureDict> pictureDicts=pictureDictDao.findByOpenId(openId);
        return pictureDicts;
    }

    @Override
    public PictureDict SavePic(MultipartFile multipartFile,String openId) {
        File pathFile=new File(this.realPath);
        if(!pathFile.exists()){
            pathFile.mkdir();
        }
        Boolean saveToDisk=false;
        String picName=multipartFile.getOriginalFilename();
        File file  =  new File(realPath,picName);
        try {
            multipartFile.transferTo(file);
            saveToDisk=true;
        }catch (Exception ex){
            saveToDisk=false;
        }
        if(saveToDisk){
            PictureDict p=new PictureDict();
            p.setOpenId(openId);
            p.setHost(this.baseHost);
            p.setPath(picName);
            p.setCreateDate(new Date());
            PictureDict saved=pictureDictDao.save(p);
            if(saved!=null){
                return saved;
            }else {
                return null;
            }
        }else {
            return null;
        }
    }

    @Override
    public Boolean deletePic(PictureDict dict) {
       pictureDictDao.delete(dict);
       String filePath=this.realPath+"\\"+dict.getPath();
       File file=new File(filePath);
       if(file.exists()){return file.delete();}else {return true;}
    }
}
