<?php
error_reporting(E_ALL);
set_time_limit(0);

require_once("connectDB.php");
$conn = new createCon();
$conn->connect();
$dbconn = $conn->myconn;
$db = $conn->db;

foreach ($_POST as $key => $value) {
    ${$key} = $value;
}

foreach ($_GET as $key => $value) {
    ${$key} = $value;
}

$sql = file_get_contents("../sql/query.sql", true);

$result = mysqli_query($dbconn, $sql);

while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
    $data[] = $row;
}

$max_count = 0;
$dates_list = [];
$dates_list['max_counts'] = 0;
$dates_list['datum'] = [];

forEach($data as $rows => $row){
    $datum = $row['datum'];


    if( !$dates_list['datum'][$datum]['data']){
        $dates_list['datum'][$datum]['data'] = [];
        $dates_list['datum'][$datum]['counts'] = 0;
        $dates_list['datum'][$datum]['max'] = 0;
    }

    if( !$dates_list['datum'][$datum]['data'][$row['okres_lau_kod']]){
        $dates_list['datum'][$datum]['data'][$row['okres_lau_kod']]  = 0;
    }
    $dates_list['datum'][$datum]['data'][$row['okres_lau_kod']] += $row['count']-0;
    $dates_list['datum'][$datum]["counts"] += $dates_list['datum'][$datum]['data'][$row['okres_lau_kod']];
    $dates_list['datum'][$datum]['max'] = max($row['count'],$dates_list['datum'][$datum]['max']);
    $max_count = max($max_count, $dates_list['datum'][$datum]["max"]);
}

$dates_list['max_counts'] = $max_count;

header("Content-type:application/json");
print_r(JSON_encode($dates_list));

?>

