<?php
header("Access-Control-Allow-Origin: *"); // * を使用してすべてのオリジンを許可（セキュリティ上の理由から必要に応じて特定のオリジンに限定）
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    exit; // オプションリクエストへの応答後に処理を終了する
}

$raw = file_get_contents('php://input'); // POSTされた生のデータを受け取る
$post_json = json_decode($raw, true); // json形式をphp変数に変換


//----------------------------------------------------------------------------------------- データベース指定
include 'db_config.php'; // データベース接続設定ファイルをインクルード

//user list
$sql_ul = "SELECT * FROM user_list"; // 適切なテーブル名に変更してください
$result_ul = $conn->query($sql_ul);

$users_ul_data = array();

if ($result_ul->num_rows > 0) {
    while($row = $result_ul->fetch_assoc()) {
        $users_ul_data[] = $row;
    }
} else {
    $users_ul_data= array("message" => "No records found.");
}

//user data
$sql = "SELECT * FROM user_data"; // 適切なテーブル名に変更してください
$result = $conn->query($sql);

$users_data = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $users_data[] = $row;
    }
} else {
    $users_data = array("message" => "No records found.");
}
//----------------------------------------------------------------------------------------- 確認作業

//ユーザーネームからパスワードを取り出す。
$user_data_from_list = "";
for ($i = 0; $i < count($users_ul_data); $i++) {
    if ($users_ul_data[$i]["user_name"] == $post_json['name']) {
        $user_data_from_list = $users_ul_data[$i];
        break;
    }
}

//判定処理
if ($user_data_from_list == "") {
    echo json_encode(array("response" => "error", "message" => "Your account not found"));
} elseif ($user_data_from_list["user_password"] != $post_json["pass"]) {
    echo json_encode(array("response" => "error", "message" => "pass is wrong"));
} else {

//----------------------------------------------------------------------------------------- 本処理
    if ($post_json["method"] == "get_data") {
        $user_content_data = "";
        for ($i = 0; $i < count($users_data); $i++) {
            if ($user_data_from_list["user_id"] == $users_data[$i]["user_id"]) {
                $user_content_data = $users_data[$i];
                break;
            }
        }

        //判定処理
        if ($user_content_data == "") {
            echo json_encode(array("response" => "error", "message" => "no your data"));
        } else {
            echo json_encode(array("response" => "success", "message" => $user_content_data));
        }

    } else {
        echo json_encode(array("response" => "error", "message" => "no or wrong method"));
    }
    
//-----------------------------------------------------------------------------------------

}




$conn->close();
?>
