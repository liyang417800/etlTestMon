package getDateFromPython;

import javax.script.*;  

import java.io.*;  

import static java.lang.System.*;  
public class ToPython  
{  

	
 public static void Toreport(String path) throws Exception {
	 Process proc = Runtime.getRuntime().exec("python "+path);  
	 proc.waitFor(); 
 }	
	
 public static void main(String args[]) throws Exception 
 {  
     String xmlName = "case3"+".xml";
     
	 String path ="/Users/liyang/Downloads/mysite/src/runner/run.py -f /Users/liyang/Downloads/mysite/src/liyang/case/case3.xml -o /Users/liyang/Downloads/mysite/src/liyang/ -n 3";
	 Toreport(path);
 } 
}  
