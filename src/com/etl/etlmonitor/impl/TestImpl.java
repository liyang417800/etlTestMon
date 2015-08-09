package com.etl.etlmonitor.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.etl.DB.DataConn;
import com.etl.etlmonitor.dao.TestDao;
import com.etl.etlmonitor.formbean.TestBean;



public class TestImpl implements TestDao{

	Statement stat = null;
	Connection conn = null;
	ResultSet rs = null;
	
	public int addTest(String title,String contenta,String contentb,String checkcase,String dayT,String pageid,String auther) throws SQLException{

		Statement stat = null;
		Connection conn = null;
		ResultSet rs = null;
		DataConn db= new DataConn();
		conn = db.getDBConn();
		stat = conn.createStatement();
		PreparedStatement ps=null;
		String sql = "insert into etl_test(title,contenta,contentb,checkcase,dayT,pageid,auther) values('"+
						title+"','"+contenta+"','"+contentb+"','"+checkcase+"','"+dayT+"','"+pageid+"','"+auther+"')";
		System.out.print(sql);
		ps = conn.prepareStatement(sql);
		int rowsForInsert = ps.executeUpdate(sql);
		return rowsForInsert;
	}


	public List getTestList() {
		String sql = "select * from etl_test";
		List list = getData(sql);
		return list;
	}



	public List getTestList(String pageInt){
		List list = null;
		if(pageInt==null||pageInt==""||pageInt.equals("")||pageInt.equals("null")){
			pageInt="1";
		}
		try {
			int count = getCount("select count(1) from etl_test");
			int strInt = (Integer.parseInt(pageInt)-1)*8;
			String sql = "select * from etl_test order by id limit "+strInt+","+"8";
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
					TestBean tb=new TestBean(rs.getInt("id"),rs.getString("title"),rs.getString("contenta"),rs.getString("contentb"),rs.getString("checkcase"),rs.getString("dayT"),rs.getString("Time"), rs.getString("auther"),rs.getString("pageid"));
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
	
	public List getTestListbyId(String id) {
		String sql = "select * from etl_test where id="+id;
		List list = getData(sql);
		return list;
	}
	
	public List getTestListbyPageId(String pageid) {
		String sql = "select * from etl_test where pageid="+pageid;
		List list = getData(sql);
		System.out.print(sql);
		return list;
	}

	public static void main(String arg[]) throws Exception{
		//List list = getData("select * from etl_test");
		//System.out.print(list.toString());
	}


	public int updateTest(String id, String title, String contenta,
			String contentb,String checkcase, String dayT, String Time, String auther) throws Exception {
		// TODO Auto-generated method stub
		Statement stat = null;
		Connection conn = null;
		ResultSet rs = null;
		DataConn db= new DataConn();
		conn = db.getDBConn();
		stat = conn.createStatement();
		PreparedStatement ps=null;
		String sql = "update etl_test set title='"+title+"' ,contenta='"+contenta+"' ,contentb='"+contentb+"' ,checkcase='"+checkcase+"',dayT='"+dayT
						+"' ,auther='"+auther+"' where id="+id;
		System.out.print(sql);
		ps = conn.prepareStatement(sql);
		int rowsForInsert = ps.executeUpdate(sql);
		System.out.print(rowsForInsert);
		return rowsForInsert;
	}


	public int delTestListbyId(String id) throws SQLException {
		// TODO Auto-generated method stub
		Statement stat = null;
		Connection conn = null;
		ResultSet rs = null;
		DataConn db= new DataConn();
		conn = db.getDBConn();
		stat = conn.createStatement();
		PreparedStatement ps=null;
		String sql = "delete from etl_test where id="+id;
		System.out.print(sql);
		ps = conn.prepareStatement(sql);
		int rowsForInsert = ps.executeUpdate(sql);
		System.out.print(rowsForInsert);
		return rowsForInsert;
	}
	
	public int delTestListbyPageId(String id) throws SQLException {
		// TODO Auto-generated method stub
		Statement stat = null;
		Connection conn = null;
		ResultSet rs = null;
		DataConn db= new DataConn();
		conn = db.getDBConn();
		stat = conn.createStatement();
		PreparedStatement ps=null;
		String sql = "delete from etl_test where pageid="+id;
		System.out.print(sql);
		ps = conn.prepareStatement(sql);
		int rowsForInsert = ps.executeUpdate(sql);
		System.out.print(rowsForInsert);
		return rowsForInsert;
	}


	public int updateTest(int id, String title, String contenta,
			String contentb, String checkcase, String dayT, String Time,
			String auther) throws Exception {
		// TODO Auto-generated method stub
		return 0;
	}




	
	
}
