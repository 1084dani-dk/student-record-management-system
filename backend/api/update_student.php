
<?php

header("Content-Type: application/json");

// Handle browser preflight request
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// Only allow PUT requests
if ($_SERVER["REQUEST_METHOD"] !== "PUT") {

    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Only PUT method is allowed"
    ]);

    exit;
}

try {

    // Check admin authentication
    require_once __DIR__ . "/../helpers/auth.php";

    // Database connection
    require_once __DIR__ . "/../config/database.php";

    // Receive JSON data
    $data = json_decode(file_get_contents("php://input"), true);

    if (!is_array($data)) {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Invalid JSON data"
        ]);

        exit;
    }

    // Get student fields
    $id = $data["id"] ?? null;
    $name = trim($data["name"] ?? "");
    $roll_no = trim($data["roll_no"] ?? "");
    $email = trim($data["email"] ?? "");
    $phone = trim($data["phone"] ?? "");
    $department = trim($data["department"] ?? "");
    $semester = $data["semester"] ?? "";

    // Validate student ID
    if (!filter_var($id, FILTER_VALIDATE_INT) || $id <= 0) {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Valid student ID is required"
        ]);

        exit;
    }

    // Required fields validation
    if (
        $name === "" ||
        $roll_no === "" ||
        $email === "" ||
        $phone === "" ||
        $department === "" ||
        $semester === ""
    ) {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "All fields are required"
        ]);

        exit;
    }

    // Email validation
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Invalid email address"
        ]);

        exit;
    }

    // Phone validation
    if (!preg_match("/^\+?[0-9\s()-]{7,20}$/", $phone)) {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Invalid phone number"
        ]);

        exit;
    }

    // Semester validation
    if (
        !filter_var($semester, FILTER_VALIDATE_INT) ||
        $semester < 1 ||
        $semester > 12
    ) {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Semester must be between 1 and 12"
        ]);

        exit;
    }

    // Check if student exists
    $checkStudent = $pdo->prepare(
        "SELECT id FROM students WHERE id = :id"
    );

    $checkStudent->execute([
        ":id" => $id
    ]);

    if (!$checkStudent->fetch()) {

        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "Student not found"
        ]);

        exit;
    }

    // Update student record
    $sql = "UPDATE students SET
            name = :name,
            roll_no = :roll_no,
            email = :email,
            phone = :phone,
            department = :department,
            semester = :semester
            WHERE id = :id";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ":name" => $name,
        ":roll_no" => $roll_no,
        ":email" => $email,
        ":phone" => $phone,
        ":department" => $department,
        ":semester" => $semester,
        ":id" => $id
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Student updated successfully!"
    ]);

} catch (PDOException $e) {

    error_log($e->getMessage());

    // Duplicate Roll Number or Email
    if ($e->getCode() == "23000") {

        http_response_code(409);

        echo json_encode([
            "success" => false,
            "message" => "Roll Number or Email already exists"
        ]);

    } else {

        http_response_code(500);

        echo json_encode([
            "success" => false,
            "message" => "Something went wrong"
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
