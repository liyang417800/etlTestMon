package com.etl.etlmonitor.action;

import java.io.IOException;
import java.io.PrintWriter;
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
import com.etl.etlmonitor.dao.TestDao;
import com.etl.etlmonitor.impl.TestImpl;


public class delAction extends HttpServlet{
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
	throws ServletException, IOException {
		int okNum=0;
	  String id = request.getParameter("id");
	  String type = request.getParameter("type");
	  TestPageDao dao = new TestImplPage();
	  TestDao casedao = new TestImpl();
	  try {
		  if(type.equals("Page")){
			  
			  okNum = casedao.delTestListbyPageId(id);
			  okNum = dao.delTestListbyId(id);
		  }else {
			  okNum = casedao.delTestListbyId(id);
		  }
		  
		  
		 // request.getSession().setAttribute("okNum",okNum);
		  PrintWriter out = response.getWriter();  
	      out.println(okNum); 
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
