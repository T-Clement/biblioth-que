<?php
	// Paramètres de connexion à la base de données

	require '../vendor/autoload.php'; #require and load require dependencies

	$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
	$dotenv->load();

	try {
		$dbCo = new PDO(
			$_ENV['DB_HOST'],
			$_ENV['DB_USER'],
			$_ENV['DB_PASSWORD'],
		);
		$dbCo->setAttribute(
			PDO::ATTR_DEFAULT_FETCH_MODE,
			PDO::FETCH_ASSOC
		);
	} catch (Exception $e) {
		die('Unable to connect to the database.
		' . $e->getMessage());
	}

	// var_dump($dbCo);
?>