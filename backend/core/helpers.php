<?php

/**
 * تنظيف النصوص القادمة من الفورم
 */
function cleanInput(string $value): string {
    return htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');
}

/**
 * توليد slug من الاسم
 */
function generateSlug(string $text): string {
    $text = strtolower(trim($text));
    $text = preg_replace('/[^a-z0-9]+/i', '-', $text);
    return trim($text, '-');
}

/**
 * التحقق من البريد الإلكتروني
 */
function isValidEmail(string $email): bool {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * توليد رقم مرجعي (orders, messages…)
 */
function generateReference(string $prefix): string {
    return strtoupper($prefix . '-' . uniqid());
}
