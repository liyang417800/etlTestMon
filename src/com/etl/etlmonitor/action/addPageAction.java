package com.etl.etlmonitor.action;

import java.io.IOException;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.etl.etlmonitor.dao.TestPageDao;
import com.etl.etlmonitor.impl.TestImplPage;


public class addPageAction extends HttpServlet{
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
	throws ServletException, IOException {
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
		Date date=new Date();
	  String pageid = request.getParameter("pageid");
	  String pagetitle = new String(request.getParameter("pagetitle").getBytes("ISO8859_1"),"utf-8");
	  String content = new String(request.getParameter("content").getBytes("ISO8859_1"),"utf-8");
	  String auther = new String(request.getParameter("auther").getBytes("ISO8859_1"),"utf-8");
	  String dayT=sdf.format(date);
	  
	  TestPageDao dao = new TestImplPage();
	  try {
		if(pageid!=null&&!pageid.equals("null")&&!pageid.equals("")){
			int okNum = dao.updateTest(pageid,pagetitle, content,dayT,auther);
		}else{
			int okNum = dao.addTest(pagetitle, content,dayT,auther);
		}
		
		response.sendRedirect("etltest/ListAction");
		//request.getRequestDispatcher("ListAction").forward(request,response);
	  } catch (Exception e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	  }
	 }
	
	
	public void doPost(HttpServletRequest req, HttpServletResponse res)
		throws ServletException, IOException {
		doGet(req, res);
	}
	
	public static void main(String arg[]) throws Exception{
		
	}
}
