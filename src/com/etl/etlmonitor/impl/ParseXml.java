package com.etl.etlmonitor.impl;

import com.etl.etlmonitor.formbean.TestBean;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.List;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import org.dom4j.io.*;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;

import org.jdom.output.Format;
import org.w3c.dom.Attr;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.w3c.dom.CDATASection;
import org.xml.sax.SAXException;

import com.etl.DB.DataConn;

public class ParseXml {
	
	
	  private static Document document;
	  
	    public static void init() {
	        try {
	            DocumentBuilderFactory factory = DocumentBuilderFactory
	                    .newInstance();
	            DocumentBuilder builder = factory.newDocumentBuilder();
	            document = builder.newDocument();
	        } catch (ParserConfigurationException e) {
	            System.out.println(e.getMessage());
	        }
	    }
	 
	    public static int createXml(String fileName,String id) throws UnsupportedEncodingException {
	    	int re=0;
	    	List getlist = null;
	    	TestImpl ti= new TestImpl();
	    	//getlist =ti.getTestListbyId(id);
	    	//System.out.print(getlist);
	    	getlist = ti.getTestList();
            
	    	
	    	//TestBean hb=(TestBean)getlist.get(0);
	    	//System.out.print(hb.getId());
	    	 
	    	init();
	    	
	        Element root = document.createElement("suite");   //创建根节点
	        document.appendChild(root);
	        
	        /* 创建一个完成的节点，start */
	        Element item = document.createElement("author");
	        //Attr name = document.createAttribute("name");
	        //name.setValue("wifi_on");
	        //item.setAttributeNode(name);
	        
	        item.appendChild(document.createTextNode("liyang"));
	        root.appendChild(item);
	        
	        Element item1 = document.createElement("description");
	        item1.appendChild(document.createTextNode("ETL测试场景case"));
	        root.appendChild(item1);
	        
	        for(int i=0;i<getlist.size();i++){
	        TestBean hb=(TestBean)getlist.get(i);
	        
	        
	        Element item2 = document.createElement("testcase");
	        Attr name2 = document.createAttribute("id");
	        item2.setAttribute("id", "case"+hb.getId());
	        
	        Element item3 = document.createElement("description");
	        
	        //new String(hb.getTitle().getBytes("GBK"), "UTF-8");
	        item3.appendChild(document.createTextNode(hb.getTitle()));
	        item2.appendChild(item3);
	        
	        Element item4 = document.createElement("inputs");
	        
	        Element item5 = document.createElement("sql1");
	        CDATASection cdata = document.createCDATASection(hb.getContenta());
	        item5.appendChild(cdata);
	        item4.appendChild(item5);
	        
            Element item6 = document.createElement("sql2"); 
	        CDATASection cdata1 = document.createCDATASection(hb.getContentb());
	        item6.appendChild(cdata1);
	        item4.appendChild(item6);
	        
	        item2.appendChild(item4);
	        
	        Element item7 = document.createElement("expects");
	        Element item8 = document.createElement("check1");
	        CDATASection cdata2 = document.createCDATASection(hb.getCheckcase());
	        item8.appendChild(cdata2);
	        item7.appendChild(item8);	        
	        item2.appendChild(item7);	        
	        root.appendChild(item2);
	        }
	        
        
	        //将DOM对象document写入到xml文件中
	        TransformerFactory tf = TransformerFactory.newInstance();
	        try {

	        	
	            Transformer transformer = tf.newTransformer();
	            DOMSource source = new DOMSource(document);
	            transformer.setOutputProperty(OutputKeys.ENCODING, "UTF-8");
	            transformer.setOutputProperty(OutputKeys.METHOD,"xml");
	            transformer.setOutputProperty(OutputKeys.INDENT, "yes");	 
	            OutputStreamWriter outputStreamWriter = new OutputStreamWriter(new FileOutputStream(fileName),"UTF-8");
	            
	            
	            //PrintWriter pw = new PrintWriter(new FileOutputStream(fileName));	            
	            StreamResult result = new StreamResult(outputStreamWriter);
	            transformer.transform(source, result);     //关键转换
	            System.out.println("生成XML文件成功!");
	            re=1;
	            
	        } catch (TransformerConfigurationException e) {
	            System.out.println(e.getMessage());
	        } catch (IllegalArgumentException e) {
	            System.out.println(e.getMessage());
	        } catch (FileNotFoundException e) {
	            System.out.println(e.getMessage());
	        } catch (TransformerException e) {
	            System.out.println(e.getMessage());
	        }
	        return re;
	    }
	 
	    public static void parserXml(String fileName) {
	        try {
	            DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
	            DocumentBuilder db = dbf.newDocumentBuilder();
	            Document document = db.parse(fileName);
	             
	            NodeList employees = document.getChildNodes();
	            
	            for (int i = 0; i < employees.getLength(); i++) {
	                Node employee = employees.item(i);
	                NodeList employeeInfo = employee.getChildNodes();
	                for (int j = 0; j < employeeInfo.getLength(); j++) {
	                    Node node = employeeInfo.item(j);
	                    NodeList employeeMeta = node.getChildNodes();
	                    for (int k = 0; k < employeeMeta.getLength(); k++) {
	                        System.out.println(employeeMeta.item(k).getNodeName()
	                                + ":" + employeeMeta.item(k).getTextContent());
	                    }
	                }
	            }
	            System.out.println("解析完毕");
	        } catch (FileNotFoundException e) {
	            System.out.println(e.getMessage());
	        } catch (ParserConfigurationException e) {
	            System.out.println(e.getMessage());
	        } catch (SAXException e) {
	            System.out.println(e.getMessage());
	        } catch (IOException e) {
	            System.out.println(e.getMessage());
	        }
	    }
	    
	    public static void main(String[] args) throws UnsupportedEncodingException {
	    	createXml("/Users/liyang/Downloads/etlTestMon/src/com/etl/etlmonitor/impl/Testxml.xml", null);
	    	//parserXml("/Users/liyang/Downloads/mysite/src/liyang/test-report_20150401112220.xml");
		}
		  public static Format FormatXML(){  
		        //格式化生成的xml文件 
		        Format format = Format.getCompactFormat();  
		        format.setEncoding("utf-8");  
		        format.setIndent(" ");  
		        return format;  
		    }  
}
