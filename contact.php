<?php
if ($_POST) {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $company = htmlspecialchars($_POST['company']);
    $message = htmlspecialchars($_POST['message']);
    
    $to = "info@formatdisc.hr";
    $subject = "New Contact Form Submission - Super-Deploy Agent";
    $body = "Name: $name\nEmail: $email\nCompany: $company\n\nMessage:\n$message";
    $headers = "From: $email\r\nReply-To: $email\r\n";
    
    if (mail($to, $subject, $body, $headers)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false]);
    }
}
?>