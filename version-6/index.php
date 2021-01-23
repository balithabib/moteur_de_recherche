<!doctype html>
<html lang="en">
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css"
          integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">

    <title>Indexation</title>
    <link rel="stylesheet" href="style.css">
    <!-- Optional JavaScript; choose one of the two! -->

    <!-- Option 1: jQuery and Bootstrap Bundle (includes Popper) -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"
            integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj"
            crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx"
            crossorigin="anonymous"></script>
    <style type="text/css">
        .center {
            display: flex;
            text-align: center;
        }
    </style>
</head>
<body>
<?php
include 'index/indexation.inc.php';
include 'mysql/server.inc.php';

$MAIN_DIRECTORY = '../CommentCaMarche';
?>

<?php
$after1 = microtime(true);

$documents = index_multiple_html_files($MAIN_DIRECTORY);

$before1 = microtime(true);
?>

<?php
$after2 = microtime(true);

save_documents($documents);

$before2 = microtime(true);
?>

<div class="container">

    <div class="row">
        <div class="col-lg-12">
            <h1 style="text-align: center">Résultats de l'indexation</h1>
        </div>
        <?php foreach ($documents as $index => $document): ?>
            <div class="col-lg-12">
                <table class="table">
                    <thead class="thead-dark">
                    <tr>
                        <th>Info</th>
                        <th>Value</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>Path</td>
                        <td><?= $document->path ?></td>
                    </tr>
                    <tr>
                        <td>Titre</td>
                        <td><?= $document->titre ?></td>
                    </tr>
                    <tr>
                        <td>Description</td>
                        <td><?= empty($document->description) ? '/' : $document->description ?></td>
                    </tr>
                    <tr>
                        <td>Taille du document en mots</td>
                        <td><?= $document->total ?></td>
                    </tr>
                    <tr>
                        <td>Mots-clés retenus</td>
                        <td><?= count($document->poid) ?></td>
                    </tr>
                    <tr>
                        <td>Top 10</td>
                        <td><?= get_top_words($document->poid, 10) ?></td>
                    </tr>
                    </tbody>
                </table>
                <br><br>
            </div>
        <?php endforeach; ?>

        <div class="col-lg-12">
            <table class="table">
                <thead class="thead-dark">
                <tr>
                    <th>Info</th>
                    <th>Mesure</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Le temps d'exécution de l'indexation</td>
                    <td><?= $before1 - $after1 ?> s</td>
                </tr>
                <tr>
                    <td>Le temps d'exécution de la sauvgarde dans la base</td>
                    <td><?= $before2 - $after2 ?> s</td>
                </tr>
                <tr>
                    <td>Le temps d'exécution total</td>
                    <td><?= $before2 - $after1 ?> s</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>


