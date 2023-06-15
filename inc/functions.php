<?php

/** get user ip address */
function get_client_ip() {
    $ipaddress = '';
    if (isset($_SERVER['HTTP_CLIENT_IP'])) {
        $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
    } else if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
    } else if (isset($_SERVER['HTTP_X_FORWARDED'])) {
        $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
    } else if (isset($_SERVER['HTTP_FORWARDED_FOR'])) {
        $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
    } else if (isset($_SERVER['HTTP_FORWARDED'])) {
        $ipaddress = $_SERVER['HTTP_FORWARDED'];
    } else if (isset($_SERVER['REMOTE_ADDR'])) {
        $ipaddress = $_SERVER['REMOTE_ADDR'];
    } else {
        $ipaddress = 'UNKNOWN';
    }

    return $ipaddress;
}

function concatenate()
{
    $return = array();
    $numargs = func_num_args();
    $arg_list = func_get_args();
    for($i = 0; $i < $numargs; $i++)
    {
        if(empty($arg_list[$i])) continue;
        $return[] = trim($arg_list[$i]);
    }
    return implode(' ', $return);
}

#function to get base domain
function app_url() {
    $server_name = $_SERVER['SERVER_NAME']; 
    if(!in_array($_SERVER['SERVER_PORT'], [80, 443])):
        $port = ":$_SERVER[SERVER_PORT]";
    else:
        $port = '';
    endif; 
    if(!empty($_SERVER['HTTPS']) && (strtolower($_SERVER['HTTPS']) == 'on' || $_SERVER['HTTPS'] == '1')):
        $scheme = 'https';
    else:
        $scheme = 'http';
    endif;
    return $scheme.'://'.$server_name.$port;
  }

  
    /*
    * disable CORS policy for api fetch requests
    */ 
    function cors() { 
        if (isset($_SERVER['HTTP_ORIGIN'])) { 
            header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Max-Age: 86400');  
        } 
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            
            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) 
                header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); 
            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
                header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}"); 
            exit(0);
        } 
    }

?>