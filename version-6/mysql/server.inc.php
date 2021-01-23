<?php
include 'connexion.inc.php';

$conn = connexionPDO();

function save_documents($documents)
{
    global $conn;
    try {
        foreach ($documents as $index_document => $document) {
            $weights = $document->poid;
            if (count($weights) != 0) {
                $title = $document->titre;
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
    if (!empty($words_and_ids)) {
        $words_ids = implode(', ', array_keys($words_and_ids));
        $existing_query = get_select_query("document_mot", "*", "id_mot IN ($words_ids) AND id_document = $id_document");
        $req = $conn->prepare($existing_query);

        if ($req->execute()) {
            $row = $req->fetchAll();
            if (count($row) == 0) {
                $existing_ids = get_id_word($row);
                $not_existing_elements = get_diff_between_by_key($words_and_ids, $existing_ids);
                $insert_query = get_insert_all_query("document_mot", "poid,id_mot,id_document", get_all_values_document_word($not_existing_elements, $weights, $id_document));
                $req = $conn->prepare($insert_query);
                if (!$req->execute()) {
                    print_error($insert_query);
                }
            } else {
                /*$update_query = get_update_query("document_word", "weight = $weights[$value]", "id_word = $index AND id_document = $id_document");
                $req = $conn->prepare($update_query);
                if (!$req->execute()) {
                    print_error($update_query);
                }*/
            }
        } else {
            print_error($existing_query);
        }
    }
}

function save_document($conn, $title, $path, $description)
{
    $existing_query = get_select_query("document", "*", "titre = \"$title\" AND path = \"$path\" AND description = \"$description\" limit 1");
    $req = $conn->prepare($existing_query);

    if ($req->execute()) {
        $row = $req->fetchAll();

        if (count($row) != 0) {
            return $row[0]['id_document'];
        }
        $insert_query = get_insert_query("document", "titre,path,description", "\"$title\",\"$path\",\"$description\"");
        $req = $conn->prepare($insert_query);
        if ($req->execute()) {
            $query_id_document = get_select_query("document", "id_document", "titre = \"$title\" AND path = \"$path\" AND description = \"$description\"  limit 1");
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
    $existing_query = get_select_query("mot", "*", "label IN ($words_values)");
    $req = $conn->prepare($existing_query);

    if ($req->execute()) {
        $row = $req->fetchAll();
        $existing_words = get_label($row);
        $not_existing_words = get_diff_between($words, $existing_words);
        if (!empty($not_existing_words)) {
            $insert_query = get_insert_all_query("mot", "label, label_order", get_all_values_word($not_existing_words));
            //echo $insert_query,'<br>';
            $req = $conn->prepare($insert_query);
            if (!$req->execute()) {
                print_error($insert_query);
            }

            $all_words = get_select_query("mot", "*", "label IN ($words_values)");
            $req = $conn->prepare($all_words);

            if ($req->execute()) {
                return to_simple_array($req->fetchAll(), $words);
            }
        }
    } else {
        print_error($existing_query);
    }
    return [];
}

function get_all_values_word($words)
{
    $elements = [];
    foreach ($words as $index => $value) {
        $split = str_split_unicode($value);
        asort($split);
        $elements[] = "(\"$value\", \"" . implode('', $split) . "\")";
    }
    return implode(', ', $elements);
}

function search_text($word)
{
    global $conn;
    if ($word != "") {
        $find_query = get_join_query("*",
            "document_mot",
            get_inner_join("document", "document_mot.id_document = document.id_document") . " " . get_inner_join("mot", "document_mot.id_mot = mot.id_mot"),
            "WHERE mot.label LIKE \"$word%\" ORDER BY document_mot.poid DESC;");
        //echo $find_query, '<br>';
        $req = $conn->prepare($find_query);
        if ($req->execute()) {
            $row = $req->fetchAll();
            if (!empty($row)) {
                return get_unique_content($row);
            }

            search_with_tow_parts($word);
        } else {
            print_error($find_query);
        }
    }
    return [];
}

function search_with_tow_parts($word)
{
    global $conn;
    $length = floor(strlen($word) / 2);
    $part1 = substr($word, 0, $length);
    $part2 = substr($word, $length);
    $find_query = get_join_query("*",
        "document_mot",
        get_inner_join("document", "document_mot.id_document = document.id_document") . " " . get_inner_join("mot", "document_mot.id_mot = mot.id_mot"),
        "WHERE mot.label LIKE \"$part1%\" OR mot.label LIKE \"%$part2\" ORDER BY document_mot.poid DESC;");
    //echo $find_query, '<br>';
    $req = $conn->prepare($find_query);
    if ($req->execute()) {
        return get_unique_content(array_filter($req->fetchAll(), function ($item) use ($word) {
            return abs(strlen($item["label"]) - strlen($word)) <= 2;
        }));
    } else {
        print_error($find_query);
    }
}


function str_split_unicode($str, $length = 1)
{
    $tmp = preg_split('~~u', $str, -1, PREG_SPLIT_NO_EMPTY);
    if ($length > 1) {
        $chunks = array_chunk($tmp, $length);
        foreach ($chunks as $i => $chunk) {
            $chunks[$i] = join('', (array)$chunk);
        }
        $tmp = $chunks;
    }
    return $tmp;
}

function get_unique_content($row)
{
    $tmp = [];
    foreach ($row as $index => $value) {
        $tmp[$value["id_document"]] = $value;
    }
    return $tmp;
}

function search_all_words($id_document)
{
    global $conn;
    if ($id_document != "") {
        $find_query = get_select_query("document_mot", "*", "document_mot.id_document = \"$id_document\"");
        $req = $conn->prepare($find_query);
        if ($req->execute()) {
            $document_words = $req->fetchAll();
            return get_all_word_by_ids($document_words);
        } else {
            print_error($find_query);
        }
    }
    return [];
}

function get_all_values_document_word($not_existing_elements, $weights, $id_document)
{
    $elements = [];
    foreach ($not_existing_elements as $id_word => $label) {
        $elements[] = "($weights[$label], $id_word,$id_document)";
    }
    return implode(', ', $elements);
}

function get_all_word_by_ids($document_word)
{
    global $conn;
    $ids_word = [];
    foreach ($document_word as $index => $value) {
        $ids_word[] = "'" . $value["id_mot"] . "'";
    }
    $ids_word = implode(',', $ids_word);

    $existing_query = get_select_query("mot", "*", "id_mot IN ($ids_word)");
    $req = $conn->prepare($existing_query);
    if ($req->execute()) {
        $words = $req->fetchAll();
        $words_weights = [];
        foreach ($words as $index => $value) {
            $words_weights[$value["label"]] = $document_word[array_search($value["id_mot"], array_column($document_word, 'id_mot'))]["poid"];
        }
        return $words_weights;
    } else {
        print_error($existing_query);
    }
    return [];
}

function get_insert_query($table, $columns, $values)
{
    return "INSERT INTO $table ($columns) VALUES ($values);";
}

function get_insert_all_query($table, $columns, $values)
{
    return "INSERT INTO $table ($columns) VALUES $values;";
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

function get_id_word($row)
{
    return array_map(function ($item) {
        return $item['id_mot'];
    }, $row);
}

function get_diff_between($words, $existing_words)
{
    return array_filter($words, function ($item) use ($existing_words) {
        return !in_array($item, $existing_words);
    });
}

function get_diff_between_by_key($words, $existing_words)
{
    return array_filter($words, function ($item) use ($existing_words) {
        return !in_array($item, $existing_words);
    }, ARRAY_FILTER_USE_KEY);
}

function to_simple_array($row, $words)
{
    $tab = [];
    foreach ($row as $index => $value) {
        if (in_array($value['label'], $words)) {
            $tab[$value['id_mot']] = $value['label'];
        }
    }
    return $tab;
}

function print_error($message)
{
    echo "Error : $message<br/>";
}

?>