package com.etl.etlmonitor.action;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.etl.etlmonitor.dao.TestPageDao;
import com.etl.etlmonitor.impl.TestImplPage;




public class ListAction extends HttpServlet{
	
	public void doGet(HttpServletRequest request, HttpServletResponse response)
	   throws ServletException, IOException {
	  response.setContentType("text/html");
	  response.setCharacterEncoding("utf-8");
	  String pagetitle = request.getParameter("pagetitle");
	  String content = request.getParameter("content");
	  String dayT = request.getParameter("dayT");
	  String auther = request.getParameter("auther");
	  String pageInt = request.getParameter("pageInt");
	  TestPageDao dao = new TestImplPage();
	  List list= dao.getTestList(pageInt);
	  
	  request.getSession().setAttribute("list",list);
	  request.getSession().setAttribute("pageInt",pageInt);
	  // PrintWriter out = response.getWriter();
	  //response.sendRedirect("assets/hdfs.jsp");
	  request.getRequestDispatcher("testlist.jsp").forward(request,response);
	  
	 // out.print(jsonResult);
	 // out.flush();
	  //out.close();
	 }
	
	
	public static void main(String arg[]) throws Exception{
		
	}
}
