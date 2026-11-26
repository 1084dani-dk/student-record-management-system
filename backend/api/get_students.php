
<?php

header("Content-Type: application/json");

// Handle OPTIONS request
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// Only allow GET
if ($_SERVER["REQUEST_METHOD"] !== "GET") {

    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Only GET method is allowed"
    ]);

    exit;
}

try {

    // Check admin authentication
    require_once __DIR__ . "/../helpers/auth.php";

    // Database connection
    require_once __DIR__ . "/../config/database.php";

    // Fetch all students
    $sql = "SELECT * FROM students ORDER BY id DESC";

    $stmt = $pdo->prepare($sql);

    $stmt->execute();

    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return JSON response
    echo json_encode([
        "success" => true,
        "total" => count($students),
        "students" => $students
    ]);

} catch (Throwable $e) {

    error_log($e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Unable to fetch student records"
    ]);

}
