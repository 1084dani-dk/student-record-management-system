
<?php

// Configure session cookie
session_set_cookie_params([
    "lifetime" => 0,
    "path" => "/",
    "secure" => false,
    "httponly" => true,
    "samesite" => "Lax"
]);

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Check admin authentication
if (!isset($_SESSION["admin_id"])) {

    http_response_code(401);

    echo json_encode([
        "success" => false,
        "authenticated" => false,
        "message" => "Unauthorized. Please login first."
    ]);

    exit;
}
