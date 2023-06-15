<?php
define('BASEPATH', "src/"); 
foreach (glob(BASEPATH . "*.php") as $api):
    include $api;
endforeach;


use LW\churches;
use LW\groups;
use LW\zones;

$zone = new zones();
$group = new groups();
$church = new churches();

function get_churches($groupid){
    global $church;
    echo json_encode($church->getChurchesByGroupId($groupid));
}


get_churches("gabagroup");


?>