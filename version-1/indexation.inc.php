<?php
/*
 * This method which parses an html file
 * return an array with the words and their number of occurrences
 * ex : [12:[...], 8:[...], ...,1:[...]]
 * with a descending sort
 */
function explode_html($path_file, $text, $separators, $array_stop_words)
{
    $head = get_head($text, $path_file);
    $html = $head;

    $space_separated = implode(' ', $html);
    $tab_words = explode_text($separators, $array_stop_words, $space_separated);
    return group_by_count($tab_words);
}

/*
 * This method takes a normal text and return an array of all the words
 * we parse with separators and deleting the empty words
 */
function explode_text($separators, $tab_stop_words, $text)
{
    $text = strtolower($text);
    $tok = strtok($text, $separators);
    $tab_words = [];
    if (strlen($tok) >= 3 && !in_array($tok, $tab_stop_words)) $tab_words[] = $tok;
    while ($tok !== false) {
        $tok = strtok($separators);
        if (strlen($tok) >= 3 && !in_array($tok, $tab_stop_words)) {
            $tab_words[] = $tok;
        };
    }
    return $tab_words;
}

/*
 * This method collect title and meta information
 */
function get_head($text, $path_file)
{
    $title = get_title($text);
    $metas = get_meta_tags($path_file);
    return [$title, $metas["description"], $metas["keywords"]];
}

/*
 * This method get title
 */
function get_title($text)
{
    return preg_match("/<title>(.*?)<\/title>/si", $text, $title) ? $title[1] : "";
}

/*
 * This method grouping by key using the number of occurrences
 */
function group_by_count($tab_words)
{
    $tab_words = array_count_values($tab_words);
    $tab_selection_words = [];
    foreach ($tab_words as $word => $count) {
        $tab_selection_words[$count][] = $word;
    }
    krsort($tab_selection_words);
    return $tab_selection_words;
}

/*
 * This method get an array of stop words
 */
function get_array_stop_words($path_file_stop_words)
{
    return explode("\n", file_get_contents($path_file_stop_words));
}

/*
 * print
 */
function print_tab_tab($tab_mots)
{
    echo "<table><thead><tr><th>count</th><th>words</th></tr></thead>";
    foreach ($tab_mots as $index => $value) {
        echo "<tr><td>$index</td><td>";
        foreach ($value as $index1 => $word) {
            echo "$word,";
        }
        echo "<hr></td></tr>";
    }
    echo "</table>";
}

function print_tab($text)
{
    foreach ($text as $index => $value) {
        echo "$index :|$value|<br/>";
    }
}

?>