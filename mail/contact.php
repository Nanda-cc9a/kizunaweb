<?php
// Check for empty fields
if(empty($_POST['name']) || empty($_POST['subject']) || empty($_POST['message']) || !filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  exit("Please fill all required fields correctly.");
}

// Honeypot Anti-Spam Check
// If the hidden 'honeypot' field is not empty, it's a bot submission
if(!empty($_POST['honeypot'])) {
    http_response_code(403);
    exit("Spam detected.");
}

// Process data
$name = strip_tags(htmlspecialchars($_POST['name']));
$email = strip_tags(htmlspecialchars($_POST['email']));
$whatsapp = strip_tags(htmlspecialchars($_POST['whatsapp']));
$m_subject = strip_tags(htmlspecialchars($_POST['subject']));
$message = strip_tags(htmlspecialchars($_POST['message']));

$to = "kizunamitraindonesia@gmail.com"; 
$email_subject = "Kontak Web Kizuna: $m_subject - $name";
$body = "Anda menerima pesan baru dari formulir kontak website KIZUNA.\n\n".
        "----- DETAIL PENGIRIM -----\n".
        "Nama     : $name\n".
        "Email    : $email\n".
        "WhatsApp : $whatsapp\n".
        "Program  : $m_subject\n\n".
        "----- PESAN -----\n".
        "$message\n\n".
        "--------------------------";

$header = "From: $email\r\n";
$header .= "Reply-To: $email\r\n";	
$header .= "Content-Type: text/plain; charset=UTF-8\r\n";

if(mail($to, $email_subject, $body, $header)) {
    echo "Pesan berhasil dikirim.";
} else {
    http_response_code(500);
    echo "Maaf, terjadi kesalahan saat mengirim pesan.";
}
?>
