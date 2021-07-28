<!DOCTYPE html>
<html>
	<head><!--文档头部-->
		<!--使用UTF-8字符编码，无此句在某些浏览器会出现乱码-->
		<meta charset = "utf-8">
		<!--文档标题，会显示在网页标题栏-->
		<title>排行榜</title>
		<style type="text/css">
		body
		{
			text-align: center;
		}
		#mask
		{
			position: absolute;
			top: 10px;
			right: 0px;
			left: 400px;
			width: 500px;
			height: 580px;
			border:#aaa 1px dashed;
			box-shadow:0 0 8px rgba(81, 81,81,0.8);
			text-align: center;
			line-height: 10px;
			border-radius: 10px;
			background-color: rgba(236, 219, 195, 0.4);
			font-family: "微软雅黑";
			color: rgba(121, 91, 10, 0.705);
			font-size: 20px;
		}
		#mask1
		{
			position: absolute;
			top: 90px;
			right: 0px;
			left: 50px;
			width: 400px;
			height: 400px;
			border:#aaa 1px dashed;
			box-shadow:0 0 8px rgba(81, 81,81,0.8);
			text-align: center;
			line-height: 40px;
			border-radius: 10px;
			background-color: rgba(236, 219, 195, 0.4);
			font-family: "微软雅黑";
			color: rgba(121, 91, 10, 0.705);
			font-size: 20px;
		}
		#mask2
		{
			position: absolute;
			top: 520px;
			right: 0px;
			left: 200px;
			width: 100px;
			height: 50px;
			border:#aaa 1px dashed;
			box-shadow:0 0 8px rgba(81, 81,81,0.8);
			text-align: center;
			line-height: 40px;
			border-radius: 10px;
			background-color: rgba(236, 219, 195, 0.4);
			font-family: "微软雅黑";
			color: rgba(121, 91, 10, 0.705);
			font-size: 20px;
		}
		
		</style>
	</head>
<body>
	<div id = "mask" >
	<h1>排行榜</h1>
	
	<div id = "mask1" >
	<?php
	$servername = "localhost";
	$username = "cmg";
	$password = "123456";
	$dbname = "webgame";
	 
	// 创建连接
	$conn = new mysqli($servername, $username, $password, $dbname);
	// Check connection
	if ($conn->connect_error) {
		die("连接失败: " . $conn->connect_error);
	} 
	 
	$sql = "SELECT id, score FROM playscore  order by score desc limit 10";
	$result = $conn->query($sql);
	 
	if ($result->num_rows > 0) {
		// 输出数据
		while($row = $result->fetch_assoc()) 
		{
			echo "ID号为：" . $row["id"]. " --- 得分: " . $row["score"]. "<br>";
		}
	} else {
		echo "0 结果";
	}
	$conn->close();

	?>
	</div>
	
	<div id = "mask2">
	<a href="./myplane.html" style = "color:rgba(121, 91, 10, 0.705);">返回菜单</a>
	</div>
	</div>


</body>
</html>