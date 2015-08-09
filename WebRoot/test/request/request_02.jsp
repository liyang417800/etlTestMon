<%@page import="java.util.Set"%>
<%@page contentType="text/html; charset=GBK" %>
<html>
	<head>	
	</head>
	<body>
		<%
			request.setCharacterEncoding("GBK");
			String name = request.getParameter("name");
			String id = request.getParameter("id");
			String[] inst = request.getParameterValues("inst");
		 %>
		<table border="1" width="100%">
			<tr>
				<td>
					–’√˚
				</td>
				<td>
					<%=name %>
				</td>
			</tr>
			<tr>
				<td>
					±‡∫≈
				</td>
				<td>
					<%=id %>
				</td>
			</tr>
			<tr>
				<td>
					–À»§
				</td>				 		   
				<td>
				
				<%
				if(inst != null){
					for(int i=0;i<inst.length;i++){
				%>
					<%=inst[i]%>
				<%
					}
				} 
				%>									
				</td>		
			</tr>						
		</table>		
	</body>
</html>