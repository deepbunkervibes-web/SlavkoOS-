<?php
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = htmlspecialchars($_POST['name'] ?? '');
    $email = htmlspecialchars($_POST['email'] ?? '');
    $company = htmlspecialchars($_POST['company'] ?? '');
    $message = htmlspecialchars($_POST['message'] ?? '');
    
    // Validate inputs
    if (empty($name) || empty($email) || empty($message)) {
        echo json_encode(['success' => false, 'message' => 'Please fill all required fields']);
        exit;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Please enter a valid email address']);
        exit;
    }
    
    // Email details
    $to = "info@formatdisc.hr";
    $subject = "New Contact Form Submission - Super-Deploy Agent";
    
    // Create email body
    $body = "
    <html>
    <head>
        <title>New Contact Form Submission</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0071e3; color: white; padding: 15px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>New Contact Form Submission</h2>
            </div>
            <div class='content'>
                <p><strong>Name:</strong> $name</p>
                <p><strong>Email:</strong> $email</p>
                <p><strong>Company:</strong> $company</p>
                <p><strong>Message:</strong></p>
                <p>$message</p>
            </div>
            <div class='footer'>
                <p>This message was sent from the Super-Deploy Agent contact form.</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    // Email headers
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    
    // Send email
    $mailSuccess = mail($to, $subject, $body, $headers);
    
    // Save to database (optional - commented out)
    /*
    $servername = "localhost";
    $username = "db_username";
    $password = "db_password";
    $dbname = "contact_form";
    
    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        $stmt = $conn->prepare("INSERT INTO contacts (name, email, company, message, submission_date) 
                               VALUES (:name, :email, :company, :message, NOW())");
        
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':company', $company);
        $stmt->bindParam(':message', $message);
        
        $stmt->execute();
        $dbSuccess = true;
    } catch(PDOException $e) {
        $dbSuccess = false;
    }
    
    $conn = null;
    */
    
    // Response
    if ($mailSuccess) {
        // Log the submission
        $log = date('Y-m-d H:i:s') . " - New contact from: $name ($email)\n";
        file_put_contents('contact_log.txt', $log, FILE_APPEND);
        
        echo json_encode(['success' => true, 'message' => 'Thank you for your message! We will get back to you soon.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'There was an error sending your message. Please try again later.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>