<%@ page contentType="text/html" pageEncoding="GBK"%>
<html>
	<body>
		<%
			String id = session.getId();
		 %>
		 
		 <h2>SessionID---><%=id %></h2>
		 <h2>SessionID����---><%=id.length() %></h2>
		 
	</body>
</html>