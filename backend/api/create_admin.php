
<?php

header("Content-Type: application/json");

// Registration permanently disabled
http_response_code(403);

echo json_encode([
    "success" => false,
    "message" => "Admin registration is disabled."
]);

exit;
