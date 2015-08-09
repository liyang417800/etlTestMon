<%@ page contentType="text/html; charset=GBK" %>
<html>
	<body>
		<%
			Cookie c[] = request.getCookies();
			for(int i=0;i<c.length;i++){
		%>
				<h2><%=c[i].getName() %>-----><%=c[i].getValue() %></h2>
		<%
			}
		 %>
	</body>
</html>