package com.etl.etlmonitor.impl;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.etl.DB.DataConn;
import com.etl.etlmonitor.dao.HdfsDao;
import com.etl.etlmonitor.formbean.HdfsBean;



public class HdfsImpl implements HdfsDao{

	Statement stat = null;
	Connection conn = null;
	ResultSet rs = null;
	
	public int addTest(String title,String contenta,String contentb,String day,String Time,String auther) throws SQLException{
		DataConn db= new DataConn();
		stat = conn.createStatement();
		PreparedStatement ps=null;
		
		String sql = "insert into etl_test(title,contenta,contentb,day,Time,auther) values("+
						title+","+contenta+","+contentb+","+day+","+Time+","+auther+")";
		ps = conn.prepareStatement(sql);
		int rowsForInsert = ps.executeUpdate(sql);
		return rowsForInsert;
	}
	
	public List getHdfsList() {
		
		List list = new ArrayList();
		
		DataConn db= new DataConn();
				 
		try {
			conn = db.getDBConn();
			rs = getData();
			HdfsBean hb= null; 

			while(rs.next())
			{  
				if (rs.getString(1) != null) {
					hb=new HdfsBean(rs.getString(1),rs.getString(2),rs.getString(3),rs.getString(4),rs.getString(5),rs.getString(6));
					list.add(hb);
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

	public ResultSet getData() throws SQLException
	{
	    stat = conn.createStatement();
	    	    	    	    
	    String sql = "select t.hdfs_path,max(decode(t.hdfs_date,to_char(sysdate-1, 'YYYYMMDD'),file_count)) as file_count,max(decode(t.hdfs_date,to_char(sysdate-2, 'YYYYMMDD'),file_count)) as file_count1,max(decode(t.hdfs_date,to_char(sysdate-1, \'YYYYMMDD\'),round(t.file_size/1024/1024/1024,2))) as file_size,max(decode(t.hdfs_date,to_char((sysdate - 2), \'YYYYMMDD\'),round(t.file_size/1024/1024/1024,2))) as file_size1,max(decode(t.hdfs_date,to_char((sysdate - 8), \'YYYYMMDD\'),round(t.file_size/1024/1024/1024,2))) as file_size7 from DATA_HDFSMONITOR t where t.hdfs_date in (to_char(sysdate-1, \'YYYYMMDD\'),to_char((sysdate-2), \'YYYYMMDD\'),to_char((sysdate-8), \'YYYYMMDD\')) group by t.hdfs_path";
	    	     
	    System.out.println(sql);    	   	    
	    ResultSet rs = stat.executeQuery(sql);
	    return rs;
	}	
	
	public List getHdfsList(String hdfs_date) {
		
		List list = new ArrayList();
		
		DataConn db= new DataConn();		
		 
		try {
			conn = db.getDBConn();
			rs = getData(hdfs_date);
			HdfsBean hb= null; 

			while(rs.next())
			{  
				hb=new HdfsBean(rs.getString(1),rs.getString(2),rs.getString(3),rs.getString(4),rs.getString(5),rs.getString(6));
				list.add(hb);
			}
			
			rs.close();
			stat.close();
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}

		return list;
	}
	
	public ResultSet getData(String hdfs_date) throws SQLException
	{
	    stat = conn.createStatement();	    
	    	    	    
	    String sql = "select t.hdfs_path,max(decode(t.hdfs_date,to_char(to_date("+hdfs_date+", 'YYYYMMDD'), 'YYYYMMDD'),file_count)) as file_count,max(decode(t.hdfs_date,to_char(to_date("+hdfs_date+", 'YYYYMMDD')-1, 'YYYYMMDD'),file_count)) as file_count1,max(decode(t.hdfs_date, to_char(to_date("+hdfs_date+",'YYYYMMDD'),'YYYYMMDD'),round(t.file_size/1024/1024/1024,2))) as file_size,max(decode(t.hdfs_date, to_char(to_date("+hdfs_date+",'YYYYMMDD')-1,'YYYYMMDD'),round(t.file_size/1024/1024/1024,2))) as file_size1,max(decode(t.hdfs_date, to_char(to_date("+hdfs_date+",'YYYYMMDD')-7,'YYYYMMDD'),round(t.file_size/1024/1024/1024,2))) as file_size7 from DATA_HDFSMONITOR t where t.hdfs_date in (to_char(to_date("+hdfs_date+",'YYYYMMDD'),'YYYYMMDD'),to_char(to_date("+hdfs_date+",'YYYYMMDD')-1,'YYYYMMDD'),to_char(to_date("+hdfs_date+",'YYYYMMDD')-7,'YYYYMMDD')) " +
	    		" group by t.hdfs_path";	    
	     
	    System.out.println(sql);    	   	    
	    ResultSet rs = stat.executeQuery(sql);
	    System.out.println("==================123=====================");
	    return rs;
	}
			
	public List getHdfsList(String hdfs_path,String hdfs_date) {
		
		List list = new ArrayList();
		
		DataConn db= new DataConn();
		
		 
		try {
			conn = db.getDBConn();
			rs = getData(hdfs_path,hdfs_date);
			HdfsBean hb= null; 

			while(rs.next())
			{  
				hb=new HdfsBean(rs.getString(1),rs.getString(2),rs.getString(3),rs.getString(4),rs.getString(5),rs.getString(6));
				list.add(hb);
			}
			
			rs.close();
			stat.close();
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}

		return list;
	}
	
	public ResultSet getData(String hdfs_path,String hdfs_date) throws SQLException
	{
	    stat = conn.createStatement();	    
	    	    	    
	    String sql = "select t.hdfs_path,max(decode(t.hdfs_date,to_char(to_date("+hdfs_date+", 'YYYYMMDD'), 'YYYYMMDD'),file_count)) as file_count,max(decode(t.hdfs_date,to_char(to_date("+hdfs_date+", 'YYYYMMDD')-1, 'YYYYMMDD'),file_count)) as file_count1,max(decode(t.hdfs_date, to_char(to_date("+hdfs_date+",'YYYYMMDD'),'YYYYMMDD'),round(t.file_size/1024/1024/1024,2))) as file_size,max(decode(t.hdfs_date, to_char(to_date("+hdfs_date+",'YYYYMMDD')-1,'YYYYMMDD'),round(t.file_size/1024/1024/1024,2))) as file_size1,max(decode(t.hdfs_date, to_char(to_date("+hdfs_date+",'YYYYMMDD')-7,'YYYYMMDD'),round(t.file_size/1024/1024/1024,2))) as file_size7 from DATA_HDFSMONITOR t where t.hdfs_date in (to_char(to_date("+hdfs_date+",'YYYYMMDD'),'YYYYMMDD'),to_char(to_date("+hdfs_date+",'YYYYMMDD')-1,'YYYYMMDD'),to_char(to_date("+hdfs_date+",'YYYYMMDD')-7,'YYYYMMDD')) " +
	    		"and t.hdfs_path like '%"+hdfs_path+"%' group by t.hdfs_path";	    
	     
	    System.out.println(sql);    	   	    
	    ResultSet rs = stat.executeQuery(sql);
	    System.out.println("=======================================");
	    return rs;
	}
	
}
