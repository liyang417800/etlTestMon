package getDateFromPython;

import javax.script.*;  

import org.python.core.Py;
import org.python.core.PyFunction;  
import org.python.core.PyInteger;  
import org.python.core.PyObject;  
import org.python.core.PyString;
import org.python.core.PySystemState;
import org.python.util.PythonInterpreter;  
  


import java.io.*;  

import static java.lang.System.*;  
public class getPythonFun  
{  
    public static void main(String args[])  
    {  
    	PythonInterpreter interpreter = new PythonInterpreter();
    	
    	PySystemState sys = Py.getSystemState();
    	sys.path.add("/System/Library/Frameworks/Python.framework/Versions/2.7/lib/python2.7/");
    	interpreter.exec("from xml.dom import minidom");
    	
    	
    	
        interpreter.execfile("/Users/liyang/Documents/workspace/python_test/src/my_utils.py");  
        PyFunction func = (PyFunction)interpreter.get("addBook",PyFunction.class);
        
  
        String s = "{\"title\":\"liyang31\",\"description1\":\"ETL测试场景\",\"id\":\"case1\",\"description\":\"目标表数据与上游数据总量是否一致\",\"sql1\":\"select count(1) from test.test\",\"sql2\":\"select count(1) from test.test\",\"check1\":\"sql1[0] == sql2[0]\"}";  
        PyObject pyobj = func.__call__(new PyString(s));  
        //System.out.println("anwser = " + pyobj.toString());  
  
  
    }//main  
}  


