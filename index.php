<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

    <title>Verificacion identidad</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">

    <link rel="stylesheet" href="./styles/theme.css"/>
    <link rel="stylesheet" href="./styles/verificacion-identidad.css"/>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
            crossorigin="anonymous"></script>

    <script src="https://kit.fontawesome.com/fb5946a778.js" crossorigin="anonymous"></script>

    <script src="https://webrtc.github.io/adapter/adapter-latest.js"></script>

    <script src="./scripts/DaonFace/Daon.FaceCapture.min.js"></script>
    <script src="./scripts/DaonDocument/Daon.DocumentCapture.min.js"></script>

    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>

</head>
<body>

<!-- Header -->
<div class="container-fluid">
    <div class="row titulo-recuperar-numero text-center">
        <div class="col">
            <div class="row my-3">
                <div class="col-12">
                    <p class="m-0 h3">Verifica tu identidad</p>
                </div>
            </div>
        </div>
    </div>
</div>


<div class="container">
</div>

<script src="./scripts/helpers.js"></script>
<script src="./scripts/captura-rostro.js"></script>
<script src="./scripts/captura-documento.js"></script>
<script src="./scripts/templates-pasos.js"></script>
<script src="./scripts/verificacion-identidad.js"></script>
<!--<script src="./dist/verificacion-identidad.js"></script>-->

<pre id="settings"></pre>
</body>

</html>



