package com.etl.etlmonitor.action;

import javax.servlet.jsp.JspWriter;
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
import javax.xml.parsers.ParserConfigurationException;

import org.xml.sax.SAXException;

import com.etl.etlmonitor.dao.TestDao;
import com.etl.etlmonitor.formbean.TestPageBean;
import com.etl.etlmonitor.impl.TestImpl;
import com.etl.etlmonitor.impl.TestImplPage;
import com.etl.etlmonitor.impl.XMLPaser;

import getDateFromPython.ToPython;
import getDateFromPython.common;
import com.etl.etlmonitor.impl.ParseXml;


public class reportAction extends HttpServlet{
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
	throws ServletException, IOException {
		///Users/liyang/Downloads/mysite/src/liyang/test-report_3.xml
		String pathid = request.getParameter("id");
		String reportpath = common.reportzPath+"test-report_"+pathid+".xml";
		XMLPaser xmlp = new XMLPaser();
		//System.out.println(reportpath);		

		int re = 1;
		
		if(re==1){
			 try{
				 System.out.print(reportpath);
				 TestImplPage ti= new TestImplPage();
				 TestPageBean hb=(TestPageBean)ti.getTestListbyId(pathid).get(0);
				 //System.out.print("_______"+hb.getPagetitle());
			     xmlp.parserXml(reportpath, response,hb.getPagetitle());
			 
			 System.out.println("Ö´ÐÐ³É¹¦~~");
			 }catch(Exception e){
				 e.printStackTrace();
			 }
		 }
		 
	}
	public void doPost(HttpServletRequest req, HttpServletResponse res)
	throws ServletException, IOException {
	doGet(req, res);
	}

	public static void main(String arg[]) throws Exception{
		
}
}
