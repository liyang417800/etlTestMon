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

import com.etl.etlmonitor.dao.TestDao;
import com.etl.etlmonitor.impl.TestImpl;


public class addAction extends HttpServlet{
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
	throws ServletException, IOException {
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
		Date date=new Date();
	  String id = request.getParameter("id");
	  String pageid = request.getParameter("pageid");
	  String title = new String(request.getParameter("title").getBytes("ISO8859_1"),"utf-8");
	  String contenta = new String(request.getParameter("contenta").getBytes("ISO8859_1"),"utf-8");
	  String contentb = new String(request.getParameter("contentb").getBytes("ISO8859_1"),"utf-8");
	  String checkcase = new String(request.getParameter("checkcase").getBytes("ISO8859_1"),"utf-8");
	  String auther = new String(request.getParameter("auther").getBytes("ISO8859_1"),"utf-8");
	  String dayT=sdf.format(date);
	  
	  TestDao dao = new TestImpl();
	  try {
		if(id!=null&&!id.equals("null")&&!id.equals("")){
			int okNum = dao.updateTest(id,title, contenta, contentb,checkcase, dayT, null, auther);
		}else{
			int okNum = dao.addTest(title, contenta, contentb,checkcase, dayT, pageid, auther);
		}
		
		response.sendRedirect("etltest/addcaseAction?pageid="+pageid);
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
