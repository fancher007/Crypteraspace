<?php
if (!defined('DB_HOST')) {
    define('DB_HOST', 'localhost');
}
if (!defined('DB_USER')) {
    define('DB_USER', 'quantu18_connectuser');
}
if (!defined('DB_PASS')) {
    define('DB_PASS', 'Quantumuser1!');
}
if (!defined('DB_NAME')) {
    define('DB_NAME', 'quantu18_connect');
}

// create connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

//check connection error
if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}
?>
