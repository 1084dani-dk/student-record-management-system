
<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Method not allowed"
    ]);
    exit;
}

session_set_cookie_params([
    "lifetime" => 0,
    "path" => "/",
    "secure" => false,
    "httponly" => true,
    "samesite" => "Lax"
]);

session_start();

if (!isset($_SESSION["admin_id"])) {
    http_response_code(401);

    echo json_encode([
        "success" => false,
        "authenticated" => false,
        "message" => "Admin is not logged in"
    ]);
    exit;
}

echo json_encode([
    "success" => true,
    "authenticated" => true,
    "admin" => [
        "id" => $_SESSION["admin_id"],
        "name" => $_SESSION["admin_name"],
        "email" => $_SESSION["admin_email"]
    ]
]);
