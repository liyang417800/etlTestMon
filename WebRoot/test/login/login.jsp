<%@page contentType="text/html"  pageEncoding="utf-8"%>
<html>
	<head>
	</head>
	<body>
		<center>
			<h1>登录界面</h1>
			<form action="login_check.jsp">
				<table border="1">
					<tr>
						<td colspan="2">
							<center>用户登录</center>
						</td>
					</tr>
					<tr>
						<td>
							登录ID
						</td>
						<td>
							<input type="text" name="id">
						</td>
					</tr>
					<tr>
						<td>
							登录密码
						</td>
						<td>
							<input type="password" name="password">
						</td>
					</tr>
					<tr>
						<td colspan="2">
							<input type="submit" value="登录">
							<input type="reset" value="重置">
						</td>
					</tr>
				</table>
			</form>			
		</center>
	</body>
</html>