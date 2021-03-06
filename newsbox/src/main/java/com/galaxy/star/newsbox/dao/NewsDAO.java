package com.galaxy.star.newsbox.dao;

import java.util.List;
import java.util.Map;

import com.galaxy.star.newsbox.bean.NewsBean;

public interface NewsDAO {
	public void addNews(NewsBean news);
	public List<NewsBean> getNewsList(Map<String,Object> paramMap);
	public NewsBean getNewsById(String newId);
	public void updateNews(NewsBean news);
	public Integer getNewsListCount(Map<String,Object> paramsMap);
	public void publishNews(Map<String,Object> paramMap);
	public void deleteNews(Map<String,Object> paramMap);
	public List<NewsBean> getMobileNewsList(Map<String,Object> paramMap);
	public Integer getMobileNewsListCount(Map<String,Object> paramsMap);
}
