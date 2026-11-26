
<?php

header("Content-Type: application/json");

// Handle preflight request
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// Only allow DELETE and POST
if (
    $_SERVER["REQUEST_METHOD"] !== "DELETE" &&
    $_SERVER["REQUEST_METHOD"] !== "POST"
) {

    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Method not allowed."
    ]);

    exit;
}

try {

    // Check admin authentication
    require_once __DIR__ . "/../helpers/auth.php";

    // Database connection
    require_once __DIR__ . "/../config/database.php";

    // Check database connection
    if (!isset($pdo) || !$pdo instanceof PDO) {
        throw new Exception("Database connection is not available.");
    }

    // Receive JSON data
    $data = json_decode(file_get_contents("php://input"), true);

    // Get student ID
    $id = $data["id"] ?? null;

    // Validate ID
    if (
        !filter_var($id, FILTER_VALIDATE_INT) ||
        $id <= 0
    ) {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Valid student ID is required."
        ]);

        exit;
    }

    // Delete student
    $sql = "DELETE FROM students WHERE id = :id";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ":id" => $id
    ]);

    // Check result
    if ($stmt->rowCount() > 0) {

        echo json_encode([
            "success" => true,
            "message" => "Student deleted successfully."
        ]);

    } else {

        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "Student not found."
        ]);
    }

} catch (Throwable $e) {

    error_log($e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Server error"
    ]);
}
