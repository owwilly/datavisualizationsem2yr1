<?php
ob_start();
 
$root = $_SERVER["DOCUMENT_ROOT"]. "/";
require_once $root. '/vendor/autoload.php';

use Ahc\Env\Loader;
(new Loader)->load($root.'.env'); 
use Ahc\Env\Retriever;

ob_end_clean();

if(Retriever::getEnv("APP_DEBUG")):
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);
endif;

?>