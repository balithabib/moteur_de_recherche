<?php

/*
 * This method return the path list of the html files contained in a directory $main_directory
 * */
function get_html_files_paths($name)
{
    $files = [];
    if ($dir = opendir($name)) {
        while ($file = readdir($dir)) {
            $full_path = $name . "/" . $file;
            if (is_directory($file, $full_path)) {
                $files = array_merge($files, get_html_files_paths($full_path));
            }
            if (is_html_file($full_path)) {
                $files[] = $full_path;
                //$files[] = realpath($full_path);
            }
        }
        closedir($dir);
    }
    return $files;
}

function is_html_file($file)
{
    $info = pathinfo($file);
    return array_key_exists("extension", $info) && ($info["extension"] == "htm" || $info["extension"] == "html");
}

function is_directory($file, $full_path)
{
    return $file != "." && $file != ".." && is_dir($full_path);
}

?>

