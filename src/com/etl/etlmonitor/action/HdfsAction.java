package com.etl.etlmonitor.action;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.etl.etlmonitor.dao.HdfsDao;
import com.etl.etlmonitor.impl.HdfsImpl;




public class HdfsAction extends HttpServlet{
	
	public void doGet(HttpServletRequest request, HttpServletResponse response)
	   throws ServletException, IOException {
	  response.setContentType("text/html");
	  response.setCharacterEncoding("utf-8");
	  
	  String hdfs_pathValue = request.getParameter("path");
	  String hdfs_dateValue = request.getParameter("hdfs_date"); 
	  
	  HdfsDao dao = new HdfsImpl();
	  
	  List list = null;
	  
	  if((hdfs_pathValue == null || "".equals(hdfs_pathValue.trim())) && (hdfs_dateValue == null || "".equals(hdfs_dateValue.trim())) ){
		  list = dao.getHdfsList();
	  }else if ((hdfs_pathValue == null || "".equals(hdfs_pathValue.trim())) && (hdfs_dateValue != null || hdfs_dateValue.length() > 0)) {
		  list = dao.getHdfsList(hdfs_dateValue);  
   	  }
	  else{
		  list = dao.getHdfsList(hdfs_pathValue,hdfs_dateValue);
	  }
	  
	  
	 /* List list1 = new ArrayList();
	  
	  HdfsBean hb1=new HdfsBean("path", "filesize", "filecount","tbsize", "szsize", "tbcount", "szcount");
	  
	  HdfsBean hb2=new HdfsBean("path", "filesize", "filecount","tbsize", "szsize", "tbcount", "szcount");
	  
	  HdfsBean hb3=new HdfsBean("path", "filesize", "filecount","tbsize", "szsize", "tbcount", "szcount");
	  
	  HdfsBean hb4=new HdfsBean("path", "filesize", "filecount","tbsize", "szsize", "tbcount", "szcount");
	  
	  list1.add(hb1);
	  list1.add(hb2);
	  list1.add(hb3);
	  list1.add(hb4);*/
	  
	  request.getSession().setAttribute("list",list);
	  request.getSession().setAttribute("hdfs_pathValue",hdfs_pathValue);
	  request.getSession().setAttribute("hdfs_dateValue",hdfs_dateValue);
	  
	  // PrintWriter out = response.getWriter();
	  
	  //response.sendRedirect("assets/hdfs.jsp");
	  request.getRequestDispatcher("hdfs.jsp").forward(request,response);
	  
	 // out.print(jsonResult);
	 // out.flush();
	  //out.close();
	 }
}
