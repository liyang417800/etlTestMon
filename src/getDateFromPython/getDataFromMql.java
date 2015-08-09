package getDateFromPython;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

import getDateFromPython.ToPython;
import getDateFromPython.common;

public class getDataFromMql {
	
	
	public static String getData(String id){
		String user = common.user;
		String pw = common.pw;
		String url = common.url;
		Connection conn = null;  
		Statement stmt = null;
		String aa ="";
		 try {  
			 	Class.forName("com.mysql.jdbc.Driver");
			    
			 	String sql = "select * from MyBlog_blogpost where id="+id;
	            conn =  DriverManager.getConnection(url, user, pw);//获取连接  
	            stmt = conn.createStatement();
	            ResultSet rs = stmt.executeQuery(sql); 
	            
	            if(rs.next()){   
	                //aa += ""rs.getString("id")+" ";
	                        
	            }
	        } catch (Exception e) {  
	            e.printStackTrace();  
	        }
		 return aa;
		
	}
	
	
	
	public static void ToXml(String jobj) throws Exception{
		String jobj1="{\"title\":\"liyang31\",\"description1\":\"ETL测试场景\",\"id\":\"case1\",\"description\":\"目标表数据与上游数据总量是否一致\",\"sql1\":\"select count(1) from test.test\",\"sql2\":\"select count(1) from test.test\",\"check1\":\"sql1[0] == sql2[0]\"}";
		
		ToPython.Toreport(jobj1);
	}
	
	public static void main(String args[]) throws Exception 
	 {  
		ToXml("1");
	 }
}
