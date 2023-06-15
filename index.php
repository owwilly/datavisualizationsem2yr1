<?php
ob_start();
header_remove("X-Powered-By");

define('ROUTES', "routes/");
define('BASEPATH', "api/");

require_once __DIR__ . '/vendor/autoload.php';
use Rakit\Validation\Validator;

/**
 * validator
 */
use Steampixel\Route;
$validator = new Validator;

/**
 * Session
*/ 
use Josantonius\Session\Session;
Session::init();

# Some files are available for future use based on choice.
#path
$path = $_SERVER['DOCUMENT_ROOT'] . "/inc/";
include $path . "connection.php";
include $path . "functions.php"; 

/**
 * mobile detect
*/ 
use Mobile_Detect;
$detect = new Mobile_Detect;

/*
 * include api files
 */
foreach (glob(BASEPATH . "*.php") as $api):
    include $api;
endforeach;

/*
 * json payload
 */
$payload = json_decode(file_get_contents('php://input'), true);

/**
 * include all routes and urlsk
 */
foreach (glob(ROUTES . "*.php") as $routes):
    include $routes;
endforeach;


// Run the router
Route::run('/');

?>