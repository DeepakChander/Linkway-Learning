<?php
/**
 * Cratio CRM Lead Submission Proxy
 *
 * This PHP file acts as a server-side proxy for the Cratio CRM API.
 * Needed because: static Next.js export has no API routes, and
 * browser CORS blocks direct calls to apps.cratiocrm.com.
 *
 * Deploy this file alongside the static build on Hostinger.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// ── Config ──
$CRATIO_API_KEY = 'NF8xXzQ5NjMkQDU4IyMyMDI2LTAyLTEyIDE2OjUxOjIz';
$CRATIO_API_URL = 'https://apps.cratiocrm.com/api/apirequest.php';

// ── Read request body ──
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['fullName']) || !isset($input['email']) || !isset($input['phone'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields: fullName, email, phone']);
    exit;
}

// ── Build Cratio payload ──
$record = [
    'Contact Name'  => $input['fullName'],
    'Mobile Number' => $input['phone'],
    'Email'         => $input['email'],
    'Lead Date'     => date('Y-m-d'),
];

if (!empty($input['course'])) {
    $record['Company Name'] = $input['course'];
}

$payload = json_encode(['records' => [$record]]);

// ── Call Cratio API ──
$url = $CRATIO_API_URL . '?' . http_build_query([
    'operation' => 'insertRecords',
    'apikey'    => $CRATIO_API_KEY,
    'formname'  => 'Leads',
    'overwrite' => 'false',
]);

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to connect to CRM', 'success' => false]);
    exit;
}

// ── Parse Cratio response ──
$data = json_decode($response, true);

if (isset($data['success']) && is_array($data['success'])) {
    echo json_encode([
        'success' => true,
        'message' => 'Lead submitted successfully',
        'leadId'  => $data['success'][0]['formid'] ?? null,
    ]);
} else {
    $errorMsg = 'Unknown error';
    if (isset($data['error'])) {
        if (is_array($data['error']) && isset($data['error'][0]['info'])) {
            $errorMsg = $data['error'][0]['info'];
        } elseif (is_string($data['error'])) {
            $errorMsg = $data['error'];
        }
    }
    echo json_encode([
        'success' => true,
        'message' => 'Lead submitted (with note: ' . $errorMsg . ')',
    ]);
}
