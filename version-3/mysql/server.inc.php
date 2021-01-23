<?php
include 'connexion.inc.php';

$conn = connexionPDO();

function save_documents($documents)
{
    global $conn;
    try {
        foreach ($documents as $index_document => $document) {
            $name = $document->name;
            $url = $document->url;
            $description = $document->description;
            $occurrences_and_words = $document->occurrences_and_words;

            //print_debug($url, $occurrences_and_words);
            $words_and_ids = save_words($conn, array_keys($occurrences_and_words));
            $id_document = save_document($conn, $name, $url, $description);
            save_document_word($conn, $id_document, $words_and_ids, $occurrences_and_words);
        }
    } catch (PDOException $e) {
        echo "Error $e->getMessage()";
        die();
    }
}

function save_occurrences_word($conn, $id_document, $words_and_ids, $occurrences_and_words)
{
    print_tab($occurrences_and_words);
    echo "<hr>";
    foreach ($words_and_ids as $index => $value) {
        $existing_query = "SELECT * FROM occurrence_word WHERE number =  $occurrences_and_words[$value] AND id_word = $index AND id_document = $id_document limit 1;";
        $req = $conn->prepare($existing_query);

        if ($req->execute()) {
            $row = $req->fetchAll();
            if (count($row) == 0) {
                $insert_query = "INSERT INTO occurrence_word (number,id_word,id_document) VALUES ($occurrences_and_words[$value], $index,$id_document);";
                $req = $conn->prepare($insert_query);
                if ($req->execute()) {
                    echo "good";
                } else {
                    echo "Error, occurrence_word table is not found!<br/>";
                }
            } else {
                echo "already exist ! (", $index, ", ", $value, ", ", $occurrences_and_words[$value], ")<br/>";
            }
        } else {
            echo "Error, occurrence_word table is not found!<br/>";
        }
    }
}

function save_document($conn, $name, $url, $description)
{
    $existing_query = "SELECT * FROM document WHERE name = \"$name\" AND chemin = \"$url\" AND description = \"$description\" limit 1;";
    $req = $conn->prepare($existing_query);

    if ($req->execute()) {
        $row = $req->fetchAll();

        if (count($row) != 0) {
            return $row[0]['id_document'];
        }
        $insert_query = "INSERT INTO document (name,chemin,description) VALUES (\"$name\", \"$url\",\"$description\");";
        $req = $conn->prepare($insert_query);
        if ($req->execute()) {
            $query_id_document = "SELECT id_document FROM document WHERE name = \"$name\" AND chemin = \"$url\" AND description = \"$description\"  limit 1;";
            $req = $conn->prepare($query_id_document);

            if ($req->execute()) {
                return $req->fetch()['id_document'];
            }
        }
    }
    echo "Error, document table is not found!<br/>";
}

function save_words($conn, $words)
{
    $words_values = get_keys_in_string_format($words);
    $existing_query = "SELECT * FROM word WHERE value IN ($words_values);";

    $req = $conn->prepare($existing_query);

    if ($req->execute()) {
        $row = $req->fetchAll();
        $existing_words = get_label($row);

        $not_existing_words = get_diff_between($words, $existing_words);

        foreach ($not_existing_words as $index => $value) {
            $insert_query = "INSERT INTO word (value) VALUES ('$value');";
            $req = $conn->prepare($insert_query);
            $req->execute();
        }

        $all_words = "SELECT * FROM word WHERE value IN ($words_values);";
        $req = $conn->prepare($all_words);

        if ($req->execute()) {
            return to_simple_array($req->fetchAll());
        }
    } else {
        echo "Error, word table is not found!<br/>";
    }

    //save_occurrences($conn, $occurrences_and_words, $words_and_ids);
    // save_document(...);
    return [];
}

function find_word($word)
{
    global $conn;
    $find_query = "SELECT document.chemin FROM occurrence_word 
                                INNER JOIN document on occurrence_word.id_document = document.id_document
                                INNER JOIN word on occurrence_word.id_word = word.id_word
                                WHERE word.value = \"$word\" ORDER BY occurrence_word.number DESC;";

    $req = $conn->prepare($find_query);
    if ($req->execute()) {
        $row = $req->fetchAll();
        foreach ($row as $index => $value) {
            echo $index, " => ", $value["chemin"], "<br/>";
        }
    } else {
        echo "Error, occurrence_word table is not found!<br/>";
    }
}

function get_keys_in_string_format($words)
{
    $tab = [];
    foreach ($words as $index => $value) {
        $tab[] = "'$value'";
    }
    return implode(',', $tab);
}

function get_values_in_string_format($occurrences_and_words)
{
    $words = [];
    foreach ($occurrences_and_words as $index => $value) {
        $words[] = "'$value'";
    }
    return implode(',', $words);
}

function get_ids($row)
{
    return array_map(function ($item) {
        return $item['id_word'];
    }, $row);
}

function get_label($row)
{
    return array_map(function ($item) {
        return $item['value'];
    }, $row);
}

function get_diff_between($words, $existing_words)
{
    return array_filter($words, function ($item) use ($existing_words) {
        return !in_array($item, $existing_words);
    });
}

function to_simple_array($row)
{
    $tab = [];
    foreach ($row as $index => $value) {
        $tab[$value['id_word']] = $value['value'];
    }
    return $tab;
}

?>