<?php

function sendMail(string $to, string $subject, string $message): bool {

    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8\r\n";
    $headers .= "From: Smart Store <no-reply@smartstore.com>\r\n";

    return mail($to, $subject, nl2br($message), $headers);
}
