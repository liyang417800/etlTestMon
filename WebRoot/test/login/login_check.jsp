<%@ page contentType="text/html" pageEncoding="utf-8" import="java.util.*,java.sql.*"  language="java"%>
<html>
	<body>
		<%
			Connection conn = null;
			PreparedStatement stmt = null;
			ResultSet rs = null;
			boolean flag = false;
			String name = null;
			try{
				Class.forName("oracle.jdbc.driver.OracleDriver");
				}
			catch(ClassNotFoundException ce){
				ce.printStackTrace();
				}
			try{
    			String url="jdbc:oracle:thin:@10.103.23.102:1521:orcl";
    			conn=DriverManager.getConnection(url,"hdfsmonitor","youku001");
    			stmt=conn.prepareStatement("select name from check_name where name=? and password=?");
    			stmt.setString(1,request.getParameter("id"));
    			stmt.setString(2,request.getParameter("password"));
    			rs=stmt.executeQuery();
		%>					
		<%
			if(rs.next()){
				name = rs.getString(1);
				flag = true;
				out.println(flag);	 
			}
		 %>
			
		</table>
		<%
			rs.close();
		  stmt.close();
          conn.close();	
          }	
          catch(Exception e){
          	e.printStackTrace();
          }
		 %>
		 <%
		 if(flag){
		 %>
		 	<jsp:forward page="login_failure.jsp">
		 		<jsp:param value="<%=name%>" name="uname"/>
		 	</jsp:forward>
		 <%
		 } else {
		 %>
		 	<jsp:forward page="login_success.jsp"/>
		 <%
		 }
		 %>			 		
	</body>		
</html>

