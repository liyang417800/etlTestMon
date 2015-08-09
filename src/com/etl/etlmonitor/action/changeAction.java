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






public class changeAction extends HttpServlet{
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
	throws ServletException, IOException {
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
		Date date=new Date();
	  
	  String id = request.getParameter("pageid");
	  TestPageDao dao = new TestImplPage();
	  try {
		  List list = dao.getTestListbyId(id);
		  request.getSession().setAttribute("list",list);
		  request.getRequestDispatcher("changeTest.jsp").forward(request,response);
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
