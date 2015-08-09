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

import com.etl.etlmonitor.dao.TestDao;
import com.etl.etlmonitor.impl.TestImpl;
import getDateFromPython.ToPython;
import getDateFromPython.common;
import com.etl.etlmonitor.impl.ParseXml;

public class zhixingAction extends HttpServlet{
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
	throws ServletException, IOException {
		 String pathid = request.getParameter("id");
		 String xmlName = common.xmlPath+"case"+pathid+".xml";
		 String reportPath = common.reportzPath;
		 String runPath = common.runPath;
		 String result = "0";
		 
		 int re = ParseXml.createXml(xmlName,pathid);
		 String path = runPath+" -f "+ xmlName +" -o "+ reportPath +" -n "+ pathid;
		 
		 if(re==1){
			 try{
				 System.out.print(path);
			 Process proc = Runtime.getRuntime().exec("python "+path);  
			 //proc.waitFor(); 
			 result = "1";
			 }catch(Exception e){
				 e.printStackTrace();
			 }
		 }
		 
		 //System.out.println(result);
		 PrintWriter out = response.getWriter();  
	     out.println(result); 
		 
		 
	  
	 }
	
	
	public void doPost(HttpServletRequest req, HttpServletResponse res)
		throws ServletException, IOException {
		doGet(req, res);
	}
	
	public static void main(String arg[]) throws Exception{
		ToPython py= new ToPython();
		py.Toreport("/Users/liyang/Downloads/mysite/src/liyang/case/case3.xml");
	}
}


