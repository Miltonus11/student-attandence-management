<?php
session_start();

if (!isset($_SESSION['logged_in']) || $_SESSION['user_role'] !== 'admin') {
    header('Location: ../loginPage.php');
    exit();
}
?>