package com.etl.etlmonitor.action;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class HdfsRefresh extends HttpServlet {
	 public void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException,IOException{
		 resp.setContentType("text/html");
		 resp.setCharacterEncoding("utf-8");
		 String date = req.getParameter("hdfs_date");
		 System.out.println(date);
		 Runtime r = Runtime.getRuntime();
		// Process p = null; 
//		 String s1 = "cmd /c echo "+date;
//		 String s2 = "cmd /c echo 20140101";
		 String s1 = "/bin/sh /opt/dyc/ssr/hdfsmonitor/hdfsmonitor.sh " + date;
		 System.out.println(s1);
		 try{ 
			 		 Process proc =r.exec(s1);
			 		InputStream stdin = proc.getInputStream();  
			 	    InputStreamReader isr = new InputStreamReader(stdin);  
			 	    BufferedReader br = new BufferedReader(isr);  
			 	    String line = null;  
			 	    System.out.println("<OUTPUT>");  
			 	    while ((line = br.readLine()) != null)  
			 	        System.out.println(line);  
			 	    System.out.println("</OUTPUT>"); 
	                 int exitVal = proc.waitFor();  
	                 System.out.println("Process exitValue: " + exitVal); 
	         } catch (Exception e) {
	        	 	 e.printStackTrace();
	                 System.out.println("Error executing notepad."); 
	         }
		 resp.sendRedirect("hdfsAction?hdfs_date="+date);
	      //req.getRequestDispatcher("hdfsAction?hdfs_date="+date).forward(req,resp); 
	 }
	 public void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException,IOException{
		 this.doGet(req, resp);
	 }
}
