<?php
include 'connexion.inc.php';

function save_documents($documents)
{
    try {
        $conn = connexionPDO();

        foreach ($documents as $index_document => $document) {
            $name = $document->name;
            $url = $document->url;
            $description = $document->description;
            $occurrences_and_words = $document->occurrences_and_words;

            print_debug($url, $occurrences_and_words);
            $words_and_ids = save_words($conn, array_keys($occurrences_and_words));
            //print_tab($words_and_ids);

            //save_occurrences($conn, $occurrences_and_words, $words_and_ids);
            // save_document(...);
        }
    } catch (PDOException $e) {
        echo "Error $e->getMessage()";
        die();
    }
}

function save_words($conn, $words)
{
    $words_values = get_keys_in_string_format($words);
    $existing_query = "SELECT * FROM word WHERE label IN ($words_values);";

    $req = $conn->prepare($existing_query);
    if ($req->execute()) {
        $row = $req->fetchAll();

        $existing_words = get_label($row);

        $not_existing_words = get_diff_between($words, $existing_words);

        foreach ($not_existing_words as $index => $value) {
            $insert_query = "INSERT INTO word (label) VALUES ('$value');";
            $req = $conn->prepare($insert_query);
            $req->execute();
        }

        $all_words = "SELECT * FROM word WHERE label IN ($words_values);";
        $req = $conn->prepare($all_words);

        if ($req->execute()) {
            return to_simple_array($req->fetchAll());
        }
    } else {
        echo "Error, your table is not found!<br/>";
    }
    return [];
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
        return $item['label'];
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
        $tab[$value['id_word']] = $value['label'];
    }
    return $tab;
}

?>