<!doctype html>
<html lang="en">
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css"
          integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">

    <title>Hello, world!</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<!-- Optional JavaScript; choose one of the two! -->

<!-- Option 1: jQuery and Bootstrap Bundle (includes Popper) -->
<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"
        integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj"
        crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx"
        crossorigin="anonymous"></script>

<div class="container d-flex justify-content-center">
    <form class="input-group col-sm-7 input-group-lg ff" method="GET" action="index.php">
        <div class="input-group-prepend"><span class="input-group-text google">
                <img src="https://img.icons8.com/color/24/000000/google-logo.png" onclick="search_text()"></span>
        </div>
        <input name="search" type="text" class="form-control">
        <div class="input-group-prepend"><span class="input-group-text microphone">
              <button type="submit"><img src="https://img.icons8.com/color/24/000000/search"></button>
        </div>
    </form>
</div>

<a href="javascript:;" onclick="window.open('file:/home/salvador/sites/indexation/data/Apprenez%20à%20programmer%20en%20C%20!%20-%20OpenClassrooms.html')">ccc</a>
<?php
include '../mysql/server.inc.php';
$search_results = search_text(array_key_exists("search", $_GET) ? $_GET["search"] : "");
if (!empty($search_results)) {
    $code = '<div class="row justify-content-center overflow-auto"><ul class="list-group">';
    foreach ($search_results as $index => $value) {
        $path = $value["path"];
        echo $path;
        $code .= '<li class="list-group-item"><a href="javascript:;" onclick="window.open();">' . $value['title'] . '</a>' . '</br>' . $value['description'] . '<br/>' . '</li>';
    }
    $code .= '</ul></div>';
    echo $code;
}
?>
</body>
</html>