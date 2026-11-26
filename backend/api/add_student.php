
<?php

header("Content-Type: application/json");

// Handle preflight request
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// Only allow POST requests
if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Only POST method is allowed"
    ]);

    exit;
}

try {

    // Check admin authentication
    require_once __DIR__ . "/../helpers/auth.php";

    // Connect database
    require_once __DIR__ . "/../config/database.php";

    // Receive JSON data
    $data = json_decode(file_get_contents("php://input"), true);

    // Check empty data
    if (!is_array($data)) {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Invalid JSON data"
        ]);

        exit;
    }

    // Get form fields
    $name = trim($data["name"] ?? "");
    $roll_no = trim($data["roll_no"] ?? "");
    $email = trim($data["email"] ?? "");
    $phone = trim($data["phone"] ?? "");
    $department = trim($data["department"] ?? "");
    $semester = $data["semester"] ?? "";

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

    // Insert student into database
    $sql = "INSERT INTO students
            (name, roll_no, email, phone, department, semester)
            VALUES
            (:name, :roll_no, :email, :phone, :department, :semester)";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ":name" => $name,
        ":roll_no" => $roll_no,
        ":email" => $email,
        ":phone" => $phone,
        ":department" => $department,
        ":semester" => $semester
    ]);

    http_response_code(201);

    echo json_encode([
        "success" => true,
        "message" => "Student added successfully!",
        "student_id" => $pdo->lastInsertId()
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
