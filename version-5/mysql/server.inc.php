<?php
include 'connexion.inc.php';

$conn = connexionPDO();

function save_documents($documents)
{
    global $conn;
    try {
        foreach ($documents as $index_document => $document) {
            $weights = $document->weights;
            if (count($weights) != 0) {
                $title = $document->title;
                $path = $document->path;
                $description = $document->description;

                $words_and_ids = save_words($conn, array_keys($weights));
                $id_document = save_document($conn, $title, $path, $description);

                save_document_word($conn, $id_document, $words_and_ids, $weights);
            }
        }
    } catch (PDOException $e) {
        print_error($e->getMessage());
        die();
    }
}

function save_document_word($conn, $id_document, $words_and_ids, $weights)
{
    foreach ($words_and_ids as $index => $value) {
        $existing_query = get_select_query("document_word", "*", "id_word = $index AND id_document = $id_document limit 1");
        $req = $conn->prepare($existing_query);

        if ($req->execute()) {
            $row = $req->fetchAll();
            if (count($row) == 0) {

                $insert_query = get_insert_query("document_word", "weight,id_word,id_document", "$weights[$value],$index,$id_document");
                $req = $conn->prepare($insert_query);
                if (!$req->execute()) {
                    print_error($insert_query);
                }
            } else {
                $update_query = get_update_query("document_word", "weight = $weights[$value]", "id_word = $index AND id_document = $id_document");
                $req = $conn->prepare($update_query);
                if (!$req->execute()) {
                    print_error($update_query);
                }
            }
        } else {
            print_error($existing_query);
        }
    }
}

function save_document($conn, $title, $path, $description)
{
    $existing_query = get_select_query("document", "*", "title = \"$title\" AND path = \"$path\" AND description = \"$description\" limit 1");
    $req = $conn->prepare($existing_query);

    if ($req->execute()) {
        $row = $req->fetchAll();

        if (count($row) != 0) {
            return $row[0]['id_document'];
        }
        $insert_query = get_insert_query("document", "title,path,description", "\"$title\",\"$path\",\"$description\"");
        $req = $conn->prepare($insert_query);
        if ($req->execute()) {
            $query_id_document = get_select_query("document", "id_document", "title = \"$title\" AND path = \"$path\" AND description = \"$description\"  limit 1");
            $req = $conn->prepare($query_id_document);

            if ($req->execute()) {
                return $req->fetch()['id_document'];
            }
        }
    }
    print_error($existing_query);
}

function save_words($conn, $words)
{
    $words_values = get_keys_in_string_format($words);
    $existing_query = get_select_query("word", "*", "label IN ($words_values)");
    $req = $conn->prepare($existing_query);

    if ($req->execute()) {
        $row = $req->fetchAll();
        $existing_words = get_label($row);

        $not_existing_words = get_diff_between($words, $existing_words);

        foreach ($not_existing_words as $index => $value) {
            $insert_query = get_insert_query("word", "label", "\"$value\"");
            $req = $conn->prepare($insert_query);
            $req->execute();
        }

        $all_words = get_select_query("word", "*", "label IN ($words_values)");
        $req = $conn->prepare($all_words);

        if ($req->execute()) {
            return to_simple_array($req->fetchAll(), $words);
        }
    } else {
        print_error($existing_query);
    }
    return [];
}

function search_text($word)
{
    global $conn;
    if ($word != "") {
        $find_query = get_join_query("*",
            "document_word",
            get_inner_join("document", "document_word.id_document = document.id_document") . " " . get_inner_join("word", "document_word.id_word = word.id_word"),
            "WHERE word.label = \"$word\" ORDER BY document_word.weight DESC;");

        $req = $conn->prepare($find_query);
        if ($req->execute()) {
            return $req->fetchAll();
        } else {
            print_error($find_query);
        }
    }
    return [];
}

function get_insert_query($table, $columns, $values)
{
    return "INSERT INTO $table ($columns) VALUES ($values);";
}

function get_select_query($table, $select, $where)
{
    return "SELECT $select FROM $table WHERE $where;";
}

function get_update_query($table, $set, $where)
{
    return "UPDATE $table SET $set WHERE $where";
}

function get_join_query($select, $table, $joins, $where)
{
    return "SELECT $select FROM $table $joins $where";
}

function get_inner_join($table, $on)
{
    return "INNER JOIN $table on $on";
}

function print_error($message)
{
    echo "Error : $message<br/>";
}

function get_keys_in_string_format($words)
{
    $tab = [];
    foreach ($words as $index => $value) {
        $tab[] = "'$value'";
    }
    return implode(',', $tab);
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

function to_simple_array($row, $words)
{
    $tab = [];
    foreach ($row as $index => $value) {
        if (in_array($value['label'], $words)) {
            $tab[$value['id_word']] = $value['label'];
        }
    }
    return $tab;
}

?>