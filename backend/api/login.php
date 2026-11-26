
<?php

header("Content-Type: application/json");

// Handle preflight request
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Method not allowed"
    ]);
    exit;
}

// HTTPS secure session
session_set_cookie_params([
    "lifetime" => 0,
    "path" => "/",
    "secure" => true,
    "httponly" => true,
    "samesite" => "Lax"
]);

session_start();

require_once __DIR__ . "/../config/database.php";

try {

    $data = json_decode(file_get_contents("php://input"), true);

    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Invalid JSON data"
        ]);
        exit;
    }

    $email = trim($data["email"] ?? "");
    $password = $data["password"] ?? "";

    if ($email === "" || $password === "") {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Email and password are required"
        ]);
        exit;
    }

    $stmt = $pdo->prepare(
        "SELECT id, name, email, password FROM admins WHERE email = :email LIMIT 1"
    );

    $stmt->execute([
        ":email" => $email
    ]);

    $admin = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$admin || !password_verify($password, $admin["password"])) {
        http_response_code(401);

        echo json_encode([
            "success" => false,
            "message" => "Invalid email or password"
        ]);
        exit;
    }

    // Prevent session fixation
    session_regenerate_id(true);

    $_SESSION["admin_id"] = $admin["id"];
    $_SESSION["admin_name"] = $admin["name"];
    $_SESSION["admin_email"] = $admin["email"];

    echo json_encode([
        "success" => true,
        "message" => "Login successful",
        "admin" => [
            "id" => $admin["id"],
            "name" => $admin["name"],
            "email" => $admin["email"]
        ]
    ]);

} catch (Throwable $e) {

    error_log($e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Server error"
    ]);
}
