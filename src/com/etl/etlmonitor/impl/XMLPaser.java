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
     //Document document=db.parse(new File("/Users/liyang/Downloads/mysite/src/liyang/test-report_20150401112220.xml"));//���ļ�������DOCUMENT����
	 Document document=db.parse(new File(fileName));//���ļ�������DOCUMENT����
	 response.setCharacterEncoding("GBK");
	 PrintWriter out = response.getWriter();
	 //out.println("*****�������XMLԪ��*****");  
     Element root=document.getDocumentElement() ;
     String rootName=root.getNodeName();
     NamedNodeMap attributes=root.getAttributes();
     
     //��ȡ�ļ�����ʱ��
     DateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
     File file = new File(fileName);
     // ������
     long modifiedTime = file.lastModified();
	 // ͨ���������������� ���ɽ�������ת��Ϊ����
	 Date d = new Date(modifiedTime);
     
     String result = attributes.getNamedItem("result").getNodeValue();
     out.println("<h1>�������ݱ����ƣ�"+reportName+"</h1>"); 
     NodeList list=root.getElementsByTagName("testsuite");//���pageԪ��
     out.println("<p>���Ա�������ʱ�䣺"+format.format(d)+"</p>");
     //NodeList list=root.getElementsByTagName("testreport");//���pageԪ��
     out.println("<p>���Խ����"+result+"</p>"); 
     
     showElem(list,response);
     

 }
 
 public static void showElem(NodeList nl,HttpServletResponse response) throws IOException{
	 PrintWriter out = response.getWriter();
	 
     
   for(int i=0;i<nl.getLength();i++){
	   out.println("<table border=\"3\" style=\"BORDER-COLLAPSE: collapse\" borderColor=#AAAAAA height=140 width=50% cellPadding=1 borderColor=#000000  >");
          Node n=nl.item(i);//�õ����ڵ�
             if(n.hasChildNodes()){
	             NamedNodeMap attributes=n.getAttributes(); //�����ڵ�����������<dbstore single="false" att="tta">
	            // System.out.println(attributes.getLength()); 
	             for(int j=0;j<attributes.getLength();j++){
		              Node attribute=attributes.item(j);
		               //�õ�������
		              String attributeName=attribute.getNodeName();
		              String attributeValue=attribute.getNodeValue();
		              response.setCharacterEncoding("GBK");
		              if(attributeName.equals("failtures")||attributeName.equals("success")||attributeName.equals("case_id")){
		            	  out.println("<tr><td width=200>"+attributeName+"</td>");
			              //�õ�����ֵ
			              out.println("<td>"+attributeValue+"</td></tr>");
		              }
	             }
	             //��ӡ�����������:att����ֵ:tta������:single����ֵ:false
             }
             
             //�ӽڵ�
          NodeList childList=n.getChildNodes();
	          for(int x=0;x<childList.getLength();x++){
	        	  Node childNode=childList.item(x);
		            //�ж�ȡ����ֵ�Ƿ�����ElementԪ��,Ŀ���ǹ��˵�
		            if(childNode instanceof Element){
	                   //�õ��ӽڵ������
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
	          } showElem(n.getChildNodes(), response);//�ݹ�
              
        }
   out.println("</table>");
              
   }
 public static void main(String[] args) throws Exception{
	 parserXml("/Users/liyang/Downloads/mysite/src/liyang/test-report_3.xml", null,null);
    
 }
  
 }