<?php
$servername = "mysql1.php.starfree.ne.jp"; // 例: "mysql123.star.ne.jp"
$username = "webkuma_harunn";
$password = "Hh86392516416";
$dbname = "webkuma_data";

// データベース接続を作成
$conn = new mysqli($servername, $username, $password, $dbname);

// 接続確認
if ($conn->connect_error) {
    die("接続失敗: " . $conn->connect_error);
}
?>
