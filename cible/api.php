<?php
require_once "inc.connexion.php";


header('Content-Type:application/json');


// data send by async js function "callAPI"
$data = json_decode(file_get_contents('php://input'), true);
$isOk = false;


if($data["action"] === "register_book") {


    // make controls 
    // not input fieds not empty ...
    // reference who respect rules
    if(strlen($data["id_book"]) < 7 || strlen($data["title"]) <=  1 || strlen($data["author"]) <= 1) {
        echo json_encode([
            "state" => false,
            "message" => "Un champ envoyé est trop court",
            "debug" => [strlen($data["id_book"]) < 7, strlen($data["title"]) <=  1, strlen($data["author"]) <= 1]
        ]);
        exit;
    }

    // control correct book_id format
        // 2 first letters of author, 2 first letters of title + 4 digits

    // $autorCode = $data["bookId"];





    $query = $dbCo->prepare("SELECT reference FROM livre WHERE reference = :id_book");
    $isOk = $query->execute([
        "id_book" => ""
    ]);

    $already_registered = $query->rowCount();

    if($already_registered > 0) {
        echo json_encode([
            "state" => false,
            "message"=> "Référence déjà éxistante en base"
        ]);
        exit;
    } 

    // close request
    $query->closeCursor();

    // ----------------------------------------------------------
    // ----------------------------------------------------------

    // insert book in database query
    $insert_query = $dbCo->prepare("INSERT INTO livre (reference, titre, auteur) VALUES (:id_book, :title, :author)");

    $isOk_insert_query = $insert_query->execute([
        "id_book" => htmlspecialchars(strip_tags($data["id_book"])),
        "title" => htmlspecialchars(strip_tags($data["title"])),
        "author" => htmlspecialchars(strip_tags($data["author"])) 
    ]);
    // register new book in database
    echo json_encode([
        "state" => $isOk_insert_query,
        "message" => "Nouveau livre enregistré en base"
    ]);
    $insert_query->closeCursor();
    exit;




}



if($data["action"] === "check_book_reference") {
    $query = $dbCo->prepare("SELECT reference FROM livre WHERE reference LIKE CONCAT( '%', :code, '%')");
    $isOk = $query->execute([
        "code" => $data["reference"]
    ]);
    $result = $query->fetchAll();
    
    echo json_encode([
        "data" => $result,
    ]);
    $query->closeCursor();
    exit;

}


if($data["action"] === "get_database_book_data") {
    $query = $dbCo->prepare("SELECT * FROM livre WHERE reference = :reference");
    $isOk = $query->execute([
        "reference" => $data["reference"]
    ]);

    $result = $query->fetch();

    echo json_encode([
        "data" => $result
    ]);
    $query->closeCursor();
    exit;

}

