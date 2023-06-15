<?php
ob_start();
header_remove("X-Powered-By");

define('ROUTES', "routes/");

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

/**
 * include all routes and urlsk
 */
foreach (glob(ROUTES . "*.php") as $routes):
    include $routes;
endforeach;


// Run the router
Route::run('/');

?>