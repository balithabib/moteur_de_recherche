<!doctype html>
<html lang="en">
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css"
          integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">

    <title>Moteur de recherche</title>
    <link rel="stylesheet" href="../style.css">
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
            justify-content: center;
            margin: auto;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="row">
        <div class="col-lg-12">
            <br>
        </div>
        <div class="col-lg-6 center input-style">
            <form class="input-group center" method="GET" action="search.php">
                <div class="input-group-prepend" style=";float: right">
                    <button type="submit" style="border-bottom-left-radius: 24px; border-top-left-radius: 24px;background: white;border: none">
                        <img style="width: 20px;height: 20px;" src="../loop.png"></button>
                </div>
                <input name="search" type="text" class="form-control">
            </form>
        </div>
        <div class="col-lg-12">
            <br>
        </div>
    </div>
</div>

<?php
include '../mysql/server.inc.php';
include '../search/nuage_mot.inc.php';
?>

<?php if (isset($_GET["search"])): ?>
    <?php $search_results = search_text(array_key_exists("search", $_GET) && ["search"] != "" ? $_GET["search"] : ""); ?>
    <?php unset($_GET["search"]); ?>
    <?php if (!empty($search_results)): ?>
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <ul class="list-group ">
                        <?php foreach ($search_results as $index => $value): ?>
                            <?php $path = $value["path"] ?>
                            <li class="list-group-item">
                                <h6><a href="<?= '../' . $path ?>"><?= $value['titre'] ?></a>
                                    <button value="btn-<?= $index ?>" type="button" class="btn btn-info btn-style">
                                        nuage+
                                    </button>
                                </h6>
                                <p><?= $value['description'] ?></p>
                                <div class="col-lg-12 tagcloud" id="tagcloud-<?= $index ?>" style="display: none">
                                    <?php echo generer_nuage(search_all_words($value["id_document"])) ?>
                                </div>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            </div>
        </div>
    <?php endif; ?>
<?php endif; ?>

<script>
    $(document).ready(function () {
        $('button').click(function () {
            let index = $(this).val().split("-")[1];
            let display = $('#tagcloud-' + index).css('display');
            if (display === "none") {
                $('#tagcloud-' + index).css('display', 'block');
            } else {
                $('#tagcloud-' + index).css('display', 'none');
            }
            console.log(index, display);
        });
    });
</script>
</body>
</html>