<?php
define('ROUTES', "routes/");
require_once __DIR__ . '/vendor/autoload.php';
/**
 * validator
 */
use Steampixel\Route;
/**
 * include all routes and urlsk
 */
foreach (glob(ROUTES . "*.php") as $routes):
    include $routes;
endforeach;


// Run the router
Route::run('/');

?>