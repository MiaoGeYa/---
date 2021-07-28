
<?php
$test_score = $_GET["Score"];

$servername = "localhost";
$username = "cmg";
$password = "123456";
$dbname = "webgame";
 
// 创建连接
$conn = new mysqli($servername, $username, $password, $dbname);
// 检测连接
if ($conn->connect_error) {
    die("连接失败: " . $conn->connect_error);
} 
 
$sql = "INSERT INTO playscore (id,score)
VALUES (NULL,$test_score)";
 
if ($conn->query($sql) === TRUE) {
    echo "新记录插入成功";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}
 
$conn->close();
?>