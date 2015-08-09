<%@ page contentType="text/html" pageEncoding="utf-8" import="java.util.*,java.sql.*"  language="java"%>
<html>
	<body>
		<%
			Connection conn = null;
			PreparedStatement stmt = null;
			ResultSet rs = null;
			try{
				Class.forName("oracle.jdbc.driver.OracleDriver");
				}
			catch(ClassNotFoundException ce){
				}
			try{
    			String url="jdbc:oracle:thin:@10.103.23.102:1521:orcl";
    			conn=DriverManager.getConnection(url,"hdfsmonitor","youku001");
    			stmt=conn.prepareStatement("select REGEXP_SUBSTR(t.hdfs_path,\'[^/]+\',37,1,\'c\') as table_name,file_count,max(decode(t.hdfs_date,to_char(sysdate - 1, \'YYYYMMDD\'),t.file_size)) as file_size,max(decode(t.hdfs_date,to_char((sysdate - 2), \'YYYYMMDD\'),t.file_size)) as file_size1,max(decode(t.hdfs_date,to_char((sysdate - 8), \'YYYYMMDD\'),t.file_size)) as file_size7 from DATA_HDFSMONITOR t where t.hdfs_date in (to_char(sysdate-1, \'YYYYMMDD\'),to_char((sysdate - 2), \'YYYYMMDD\'),to_char((sysdate - 8), \'YYYYMMDD\')) group by REGEXP_SUBSTR(t.hdfs_path,\'[^/]+\',37,1,\'c\'),file_count");
    			rs=stmt.executeQuery();
		%>
		<table border="1" width="100%">
			<tr>
				<td>
				数据表
				</td>
				<td>
				文件个数
				</td>
				<td>
				文件大小
				</td>
				<td>
				昨天
				</td>
				<td>
				七天前
				</td>				
			</tr>
			
		<%
			while(rs.next()){
		 %>
		 		<tr>
		 		<td>
				<%=rs.getString(1) %>
				</td>
				<td>
				<%=rs.getString(2) %>
				</td>
				<td>
				<%=rs.getString(3) %>
				</td>
				<td>
				<%=rs.getString(4) %>
				</td>
				<td>
				<%=rs.getString(5) %>
				</td>
				</tr>
		<%
			}
		 %>
			
		</table>
		<%
			rs.close();
		  stmt.close();
          conn.close();	
          }	
          catch(Exception e){}
		 %>			
	</body>		
</html>

