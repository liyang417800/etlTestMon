package com.etl.etlmonitor.action;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import com.etl.etlmonitor.dao.TestPageDao;
import com.etl.etlmonitor.formbean.TestBean;
import com.etl.etlmonitor.impl.TestImpl;
import com.etl.etlmonitor.impl.TestImplPage;




public class CaseListAction extends HttpServlet{
	
	public void doGet(HttpServletRequest request, HttpServletResponse response)
	   throws ServletException, IOException {
	  response.setContentType("text/html");
	  response.setCharacterEncoding("utf-8");
	  String id = request.getParameter("id");
	  TestImpl dao = new TestImpl();
	  List caselist= dao.getTestListbyId(id);
	  TestBean hb=(TestBean)caselist.get(0);
	  //  request.getSession().setAttribute("caselist",caselist);
	  
	  JSONObject obj = new JSONObject();
	  obj.put("id", hb.getId());
	  obj.put("title", hb.getTitle());
	  obj.put("cona", hb.getContenta());
	  obj.put("conb", hb.getContentb());
	  obj.put("checkcase", hb.getCheckcase());
	  obj.put("auther", hb.getAuther());
	  
	  PrintWriter out = response.getWriter();  
      out.println(obj); 
	 }
	
	
	public static void main(String arg[]) throws Exception{
		
	}
}
