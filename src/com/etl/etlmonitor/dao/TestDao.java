package com.etl.etlmonitor.dao;

import java.sql.SQLException;
import java.util.List;




public interface TestDao {

	public List getTestList(String pageInt);
	public List getTestListbyId(String id);
	public List getTestListbyPageId(String pageid);
	public int delTestListbyId(String id) throws SQLException;
	public int delTestListbyPageId(String id) throws SQLException;
	public int updateTest(String id,String title,String contenta,String contentb,String checkcase,String dayT,String Time,String auther) throws Exception;
	public int addTest(String title,String contenta,String contentb,String checkcase,String dayT,String pageid,String auther) throws SQLException;
}
