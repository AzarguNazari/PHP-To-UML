<?php
  session_start();
  unset($_SESSION['email']);
  unset($_SESSION['pass']);
  unset($_SESSION['error']);
  session_destroy();
  header("Location: ../index.php");
  exit;