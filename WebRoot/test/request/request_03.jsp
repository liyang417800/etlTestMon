<%@page import="java.util.Enumeration"%>
<%@page import="java.util.Set"%>
<%@page contentType="text/html; charset=GBK" %>
<html>
	<head>	
	</head>
	<body>
		<%
			request.setCharacterEncoding("GBK");
			Enumeration enu = request.getParameterNames(); 
		 %>
		<center>
		<table border="1">
			<tr>
				<td>
					参数名称
				</td>
				<td>
					参数值
				</td>
			</tr>
			
		<%
			while(enu.hasMoreElements()){
				String paraName = (String)enu.nextElement();
		%>
			<tr>
				<td><%=paraName %></td>
				<td>
		<%
				if(paraName.startsWith("**")){
					String[] paraValue = request.getParameterValues(paraName);
					for(int i=0;i<paraValue.length;i++){
		%>			
					<%=paraValue[i] %>	
		<%
					}
				} else {
					String paraValue = request.getParameter(paraName);
		 %>									
					<%=paraValue %> 
		 <%			
				}
		 %>
					</td>
				</tr>
		<%		
			}
		 %>														
		</table>
		</center>		
	</body>
</html>