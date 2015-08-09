package com.etl.etlmonitor.dao;

import java.sql.SQLException;
import java.util.List;




public interface TestPageDao {

	public List getTestList(String pageidInt);
	public List getTestListbyId(String pageid);
	public int delTestListbyId(String pageid) throws SQLException;
	public int updateTest(String pageid,String pagetitle,String content,String dayT,String auther) throws Exception;
	public int addTest(String pagetitle,String content,String dayT,String auther) throws SQLException;
}

