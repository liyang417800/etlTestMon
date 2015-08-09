<hmtl>
	<head>
		<title>测试文件</title>
	</head>
	<body>
		<table border="1" width="100%">
			<tr>
				<%
					int rows = 0;
					int cols = 0;
					try{
						rows = Integer.parseInt(request.getParameter("row"));
						cols = Integer.parseInt(request.getParameter("col"));
					}
					catch(Exception e){}
					for(int i=1;i<=rows;i++){
				%>
					<tr>
				<% 
						for(int j=1;j<=cols;j++){
				%>	
						<td><%=(i*j) %></td>	
				<% 		
						}
				%>		 
					</tr>
				<%
					}
				 %>
		</table>
	</body>
</hmtl>