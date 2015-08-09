package com.etl.DB;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Properties;

public class DataConn {

	String CONNRUL;
	String DRIVERNAME;
	String USERNAME;   
	String PASSWORD;
	
    Connection conn = null;
    
	public DataConn(){
		init();
	}
    
	public void init(){
		Properties props = new Properties();
		InputStream in;
		try {
			in = getClass().getResourceAsStream(
					"/source/commonConfig.properties");
			props.load(in);
		} catch (Exception e) {
			System.out.print(e.getMessage());
		}
		if (props.isEmpty()) {
			System.out.print("commonConfig.properties is null");
		}
		CONNRUL = props.get("CONNRUL").toString();
		DRIVERNAME = props.get("DRIVERNAME").toString();
		USERNAME = props.get("USERNAME").toString();
		PASSWORD = props.get("PASSWORD").toString();
	}
	
	public Connection getDBConn() throws SQLException
	{
		try {
			Class.forName(DRIVERNAME);
		} catch (ClassNotFoundException e1) {
			e1.printStackTrace();
		}
		   conn = DriverManager.getConnection(CONNRUL, USERNAME, PASSWORD);
	 return conn;
	}
	
	public void closedconn() throws SQLException
	{
		conn.close();
	}

	
		
}
