package com.etl.etlmonitor.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.etl.DB.DataConn;
import com.etl.etlmonitor.dao.TestPageDao;
import com.etl.etlmonitor.formbean.TestPageBean;



public class TestImplPage implements TestPageDao{

	Statement stat = null;
	Connection conn = null;
	ResultSet rs = null;
	
	public int addTest(String pagetitle,String content,String dayT,String auther) throws SQLException{

		Statement stat = null;
		Connection conn = null;
		ResultSet rs = null;
		DataConn db= new DataConn();
		conn = db.getDBConn();
		stat = conn.createStatement();
		PreparedStatement ps=null;
		String sql = "insert into etl_testPage(pagetitle,content,dayT,auther) values('"+
						pagetitle+"','"+content+"','"+dayT+"','"+auther+"')";
		System.out.print(sql);
		ps = conn.prepareStatement(sql);
		int rowsForInsert = ps.executeUpdate(sql);
		return rowsForInsert;
	}


	public List getTestList() {
		String sql = "select * from etl_testPage";
		List list = getData(sql);
		return list;
	}



	public List getTestList(String pageidInt){
		List list = null;
		if(pageidInt==null||pageidInt==""||pageidInt.equals("")||pageidInt.equals("null")){
			pageidInt="1";
		}
		try {
			int count = getCount("select count(1) from etl_testPage");
			int strInt = (Integer.parseInt(pageidInt)-1)*8;
			String sql = "select * from etl_testPage order by pageid limit "+strInt+","+"8";
			list = getData(sql);
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return list;
	}
	


	public int getCount(String sql) throws SQLException {  
	    DataConn db= new DataConn();
		conn = db.getDBConn();
		stat = conn.createStatement(); 
	    ResultSet rs = stat.executeQuery(sql);  
	    int count = 0;  
	    if (rs.next()) {  
	        count = rs.getInt(1);  
	    }  
	    rs.close();  
	    stat.close();  
	    conn.close();  
	    return count;
	} 
	
	public List getData(String sql) {
		List list = new ArrayList();
		DataConn db= new DataConn();
		try {
			conn = db.getDBConn();
			stat = conn.createStatement();
			ResultSet rs = stat.executeQuery(sql);
			while(rs.next())
			{  
				if (rs.getString(1) != null) {
					TestPageBean tb=new TestPageBean(rs.getInt("pageid"),rs.getString("pagetitle"),rs.getString("content"),rs.getString("dayT"),rs.getString("auther"));
					list.add(tb);
				}
			}
			rs.close();
			stat.close();
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return list;
	}
	
	public List getTestListbyId(String pageid) {
		String sql = "select * from etl_testPage where pageid="+pageid;
		System.out.print(sql);
		List list = getData(sql);
		return list;
	}

	public static void main(String arg[]) throws Exception{
		//List list = getData("select * from etl_test");
		//System.out.print(list.toString());
	}


	public int updateTest(String pageid, String pagetitle, String content,
			String dayT, String auther) throws Exception {
		// TODO Auto-generated method stub
		Statement stat = null;
		Connection conn = null;
		ResultSet rs = null;
		DataConn db= new DataConn();
		conn = db.getDBConn();
		stat = conn.createStatement();
		PreparedStatement ps=null;
		String sql = "update etl_testPage set pagetitle='"+pagetitle+"' ,content='"+content+"' ,dayT='"+dayT
						+"' ,auther='"+auther+"' where pageid="+pageid;
		System.out.print(sql);
		ps = conn.prepareStatement(sql);
		int rowsForInsert = ps.executeUpdate(sql);
		System.out.print(rowsForInsert);
		return rowsForInsert;
	}


	public int delTestListbyId(String pageid) throws SQLException {
		// TODO Auto-generated method stub
		Statement stat = null;
		Connection conn = null;
		ResultSet rs = null;
		DataConn db= new DataConn();
		conn = db.getDBConn();
		stat = conn.createStatement();
		PreparedStatement ps=null;
		String sql = "delete from etl_testPage where pageid="+pageid;
		System.out.print(sql);
		ps = conn.prepareStatement(sql);
		int rowsForInsert = ps.executeUpdate(sql);
		System.out.print(rowsForInsert);
		return rowsForInsert;
	}


	public int updateTest(int pageid, String pagetitle,String content,String dayT,String auther) throws Exception {
		// TODO Auto-generated method stub
		return 0;
	}




	
	
}
