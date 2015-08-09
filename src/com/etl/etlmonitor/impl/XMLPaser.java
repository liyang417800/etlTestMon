package com.etl.etlmonitor.impl;

import getDateFromPython.common;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Document;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.w3c.dom.Element;
import org.xml.sax.SAXException;


public class XMLPaser {
	
 
 public static void parserXml(String fileName,HttpServletResponse response,String reportName) throws ParserConfigurationException, SAXException, IOException {

	 DocumentBuilder db=DocumentBuilderFactory.newInstance().newDocumentBuilder();
     //Document document=db.parse(new File("/Users/liyang/Downloads/mysite/src/liyang/test-report_20150401112220.xml"));//把文件解析成DOCUMENT类型
	 Document document=db.parse(new File(fileName));//把文件解析成DOCUMENT类型
	 response.setCharacterEncoding("GBK");
	 PrintWriter out = response.getWriter();
	 //out.println("*****下面遍历XML元素*****");  
     Element root=document.getDocumentElement() ;
     String rootName=root.getNodeName();
     NamedNodeMap attributes=root.getAttributes();
     
     //获取文件创建时间
     DateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
     File file = new File(fileName);
     // 毫秒数
     long modifiedTime = file.lastModified();
	 // 通过毫秒数构造日期 即可将毫秒数转换为日期
	 Date d = new Date(modifiedTime);
     
     String result = attributes.getNamedItem("result").getNodeValue();
     out.println("<h1>测试数据表名称："+reportName+"</h1>"); 
     NodeList list=root.getElementsByTagName("testsuite");//获得page元素
     out.println("<p>测试报告生成时间："+format.format(d)+"</p>");
     //NodeList list=root.getElementsByTagName("testreport");//获得page元素
     out.println("<p>测试结果："+result+"</p>"); 
     
     showElem(list,response);
     

 }
 
 public static void showElem(NodeList nl,HttpServletResponse response) throws IOException{
	 PrintWriter out = response.getWriter();
	 
     
   for(int i=0;i<nl.getLength();i++){
	   out.println("<table border=\"3\" style=\"BORDER-COLLAPSE: collapse\" borderColor=#AAAAAA height=140 width=50% cellPadding=1 borderColor=#000000  >");
          Node n=nl.item(i);//得到父节点
             if(n.hasChildNodes()){
	             NamedNodeMap attributes=n.getAttributes(); //遍历节点所有属性如<dbstore single="false" att="tta">
	            // System.out.println(attributes.getLength()); 
	             for(int j=0;j<attributes.getLength();j++){
		              Node attribute=attributes.item(j);
		               //得到属性名
		              String attributeName=attribute.getNodeName();
		              String attributeValue=attribute.getNodeValue();
		              response.setCharacterEncoding("GBK");
		              if(attributeName.equals("failtures")||attributeName.equals("success")||attributeName.equals("case_id")){
		            	  out.println("<tr><td width=200>"+attributeName+"</td>");
			              //得到属性值
			              out.println("<td>"+attributeValue+"</td></tr>");
		              }
	             }
	             //打印出结果属性名:att属性值:tta属性名:single属性值:false
             }
             
             //子节点
          NodeList childList=n.getChildNodes();
	          for(int x=0;x<childList.getLength();x++){
	        	  Node childNode=childList.item(x);
		            //判断取出的值是否属于Element元素,目的是过滤掉
		            if(childNode instanceof Element){
	                   //得到子节点的名字
	            	   response.setCharacterEncoding("GBK");
	            	   //PrintWriter out = response.getWriter();
	                   String childNodeName=childNode.getNodeName();
	                   String childNodeValue=childNode.getTextContent();
	                   if(!childNodeName.equals("testcase")){
		                   
		                   if(childNodeName.equals("informations")){
		                	   out.println("<tr><td>"+childNodeName+"</td><td>"+childNodeValue.substring(childNodeValue.indexOf("[")+1,childNodeValue.indexOf("]"))+"</td></tr>");
		                   }else{
		                	   out.println("<tr><td>"+childNodeName+"</td><td>"+childNodeValue+"</td></tr>");
		                   }
	                   }
	               }
	          } showElem(n.getChildNodes(), response);//递归
              
        }
   out.println("</table>");
              
   }
 public static void main(String[] args) throws Exception{
	 parserXml("/Users/liyang/Downloads/mysite/src/liyang/test-report_3.xml", null,null);
    
 }
  
 }