const CapturaRostro = (() => {
  let modulosCargados = false;
  let resizingOvalo = false;

  const configuration = {
    width: 1280,
    height: 720,
    facingMode: 'environment',
  };

  const fc = new Daon.FaceCapture(configuration);

  const traducciones = {
    'Hold on for a few seconds': 'Espera unos segundos',
    'No face could be found in the image':
      'No se pudo encontrar ningún rostro en la imagen',
    'Multiple faces found in the image':
      'Se encontraron múltiples rostros en la imagen',
    'Could not find the eyes in the image':
      'No se pueden encontrar los ojos en la imagen',
    'Face too small. Please move closer to camera':
      'Rostro demasiado pequeño. Por favor, acercate a la cámara',
    'Image too dark. Please improve lighting':
      'Imagen demasiado oscura. Por favor, mejora la iluminación',
    'Face image too soft, lacking details. Please improve lighting':
      'La imagen de la cara es demasiado suave, falta detalles. Por favor, mejora la iluminación',
    'Image blur detected. Reduce motion or improve lighting':
      'Se ha detectado desenfoque de la imagen. Reduce el movimiento o mejora la iluminación',
    'Face is too close to the camera':
      'El rostro está demasiado cerca de la cámara',
    'Face lighting not uniform': 'Iluminación del rostro no es uniforme',
    'Face is tilted. Please look directly at the camera':
      'El rostro está inclinado. Por favor, mira directamente a la cámara',
    'Face not frontal. Please look directly at the camxwera':
      'El restro no está de frente. Por favor, mira directamente a la cámara',
    'The eyes in the image appear to be closed':
      'Los ojos en la imagen parecen estar cerrados',
    'Face continuity error.': 'Error de continuidad en el rostro',
    'Face image not of sufficient quality':
      'La imagen del rostro no es de suficiente calidad',
    'Please center your face in the oval':
      'Por favor, centra tu rostro dentro del óvalo',
  };

  const coloresBorde = Object.freeze({
    DOCUMENTO_APROBADO: '#66cb9f',
    DOCUMENTO_NO_ENCONTRADO: '#f16063',
    DOCUMENTO_ENCONTRADO: '#fac109',
  });

  const serverPublicKey = {
    kty: 'RSA',
    'x5t#S256': 'ozZ9LtuUcz1Mux8uyqIGAPTXIwG_Mw1LXnCxOBcczW0',
    e: 'AQAB',
    use: 'enc',
    kid: 'QTAzMYfRl3-PaWD8OE9IqCyYaQ',
    x5c: [
      'MIIE2TCCAsOgAwIBAgIRALDHs3Nt2Enfg1a2VXwrnYgwCwYJKoZIhvcNAQELMEcxFTATBgNVBAMMDElkZW50aXR5WCBDQTENMAsGA1UECgwERGFvbjESMBAGA1UECwwJSWRlbnRpdHlYMQswCQYDVQQGEwJJRTAeFw0yMjA1MjcxMzQ4NTZaFw0zMjA1MjcxMzQ4NTZaMFoxDTALBgNVBAoMBERhb24xEjAQBgNVBAsMCUlkZW50aXR5WDELMAkGA1UEBhMCSUUxKDAmBgNVBAMMH0RFX0RBT05fQVVUSEVOVElDQVRJT05fREFUQV9LRUswggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCjOZB0usp0RNGLn3FhZYrgx5DkTqHysrFWYKoaekTM6vQ5UuFSkcZKGChspxQPmH6Wj76clSUEs7BAilIaDZkX2N2efYli/xFpgv1qaEd7LT021U3uVtHl5kGbODSjfZBFckAS6AW10Ftrkuxmy/vkRg546NgPCbUwu2tElDpWnZOrkdaGtET1W/vdSXYDtBYw9w4ES5Wl/2po31ZgOGJSHAhFJYLqDAkK+BAka54JSum6pYYVDuQ++8a2nyHIedHmiqoLR4DLLTwfh2tIN7J9e4FQ+qgvb+nC1KukopEu+ZVXC+tKdMKVyfPtPmkiZfp4KvxekpF0jaLUm8sRJLbBAgMBAAGjgbAwga0wfgYDVR0jBHcwdYAUZplSSlDw67i7wEa+1wVzqzvdL5ahS6RJMEcxFTATBgNVBAMMDElkZW50aXR5WCBDQTENMAsGA1UECgwERGFvbjESMBAGA1UECwwJSWRlbnRpdHlYMQswCQYDVQQGEwJJRYIQKuhll9ePQGSsywpelEVwazAdBgNVHQ4EFgQUgfBQ2/rDJMye6MFL2eFzbrUOqIgwDAYDVR0TAQH/BAIwADALBgkqhkiG9w0BAQsDggIBAJBv8/2RLpUNaolUGXVqIsc57gon8arG/SQa6ZaP0bSBezGuqAWD28bdbTKaAT44lLKdLya+BkdtmYDZw8PpyFbQgbdSnAhrk1+qrHvNIy+chJona4vDOOVnkD0PtlUcKQEVUEaWs/pzJhF/QyDRlX1yAkVNYUSXHg27MAzJxh0rZkRVNp3eJDk2oIxsElELez+CWTRWNP8d3RHcDNRyLB2+QI4NgGCa8UglFezQnL9p0JzC1ofNbp+NmRY/BuxUcNPr1qNVvtUYwVGFbHd2BpcFIX37Cwr6qdZZ3PCVRyhhs3EVPRot27ANo5DJDn6fVwycCE9/YhohZKdMpZebQSMV9fQmmjXYwOQcMLNoHU8MhAhdCdIUkDq8TcOtrZlhvphtzrCUGCj9eorM6zwoP66whNq0f7vR2BfHLtrHh+BIk8ej2SvrK8SgsfZaZfLvssW7V3B5OxNViuywN/dkg5rnWtHe4Bpet/fUgSLIYbbVi8K30LqIOiVfO1/nEqAhwNUroQ456R37xxFNHTn9HK3eijIPbva3YYLKVHxj9thkJyX7IpdImuXYPmkwQSGc4j/Ypk32StRAQXoM09F5yDuV4aWROuAiFoYRD86Ojna3DXfu09cVCQfqHsL1c5EsQzzQIwZ5ejdM58ldtrNF+h2cNVV8NwXXdyu74ZJ9lmVE',
    ],
    n: 'ozmQdLrKdETRi59xYWWK4MeQ5E6h8rKxVmCqGnpEzOr0OVLhUpHGShgobKcUD5h-lo--nJUlBLOwQIpSGg2ZF9jdnn2JYv8RaYL9amhHey09NtVN7lbR5eZBmzg0o32QRXJAEugFtdBba5LsZsv75EYOeOjYDwm1MLtrRJQ6Vp2Tq5HWhrRE9Vv73Ul2A7QWMPcOBEuVpf9qaN9WYDhiUhwIRSWC6gwJCvgQJGueCUrpuqWGFQ7kPvvGtp8hyHnR5oqqC0eAyy08H4drSDeyfXuBUPqoL2_pwtSrpKKRLvmVVwvrSnTClcnz7T5pImX6eCr8XpKRdI2i1JvLESS2wQ',
  };

  const idxUserId = 'QTAzM6-hKbpdcmBmsOak4pr2VQ';

  const pasos = Helpers.pasos;

  async function loadDFQModuleAsync() {
    return new Promise((resolve, reject) => {
      fc.loadDFQModule({
        urlFaceDetectorWasm:
          window.location.origin +
          '/Pruebadevida/scripts/DaonFace/DaonFaceQuality.wasm',

        onFaceModuleLoaded: ({ isLoaded, error, ...rest }) => {
          if (isLoaded) {
            resolve(rest);
          } else {
            reject(error);
          }
        },
      });
    });
  }

  async function cargarDFQModule() {
    try {
      const result = await loadDFQModuleAsync();

      modulosCargados = true;
    } catch (error) {}
  }

  async function startCameraAsync(gyroscopeActive) {
    const video = document.querySelector('video');

    try {
      if (gyroscopeActive) {
        await fc.isGyroscopeActive();
      }
      const result = await fc.startCamera(video);
    } catch (error) {}
  }

  async function iniciarCamara(gyroscopeActive) {
    try {
      const result = await startCameraAsync(gyroscopeActive);
    } catch (error) {
      console.error('camera error', error);
    }
  }

  (async function () {
    await cargarDFQModule();

    const video = document.getElementById('video-rostro');

    video.onloadedmetadata = function () {
      startFaceDetector();
    };
  })();

  function startFaceDetector() {
    const video = document.querySelector('video');

    const settings = video.srcObject.getVideoTracks()[0].getSettings();

    fc.startFaceDetector(
      {
        onFaceDetectorInitialized: function () {},
        onFaceDetectorError: function (err) {},
        onFaceDetectorFeedback: function (detectorFeedbackObject) {
          if (detectorFeedbackObject.result === 'PASS') {
            resizeOvaloOnResize();

            Helpers.mostrarPaso(
              pasos.CONFIRMAR_FOTO_ROSTRO,
              detectorFeedbackObject.faceImage
            );

            stopCapture();
          } else {
            if (detectorFeedbackObject.feedback) {
              setOvalClass(detectorFeedbackObject.feedback.code);
            }

            setTimeout(() => {
              fc.findFace();
            }, 50);

            const feedbackElement = document.getElementById('feedback');

            const mensajeError = traducirMensajeError(detectorFeedbackObject);
            if (feedbackElement.innerText !== mensajeError) {
              feedbackElement.innerText = mensajeError;
            }
          }
        },
      },
      {
        idxUserId,
        serverPublicKey,
      }
    );
  }

  function startCamera(gyroscopeActive) {
    const video = document.querySelector('video');

    if (gyroscopeActive) {
      fc.isGyroscopeActive()
        .then(() => {
          return fc.startCamera(video);
        })
        .then((result) => {})
        .catch((error) => {
          console.error('camera error', error);
        });
    } else {
      fc.startCamera(video)
        .then((result) => {})
        .catch((error) => {
          console.error('camera error', error);
        });
    }
  }

  function stopCapture() {
    fc.stopCamera();
  }

  function findFace() {
    const imageData = fc.findFace();
  }

  const setOvalClass = (code) => {
    const ovalElement = document.querySelector('#oval-rostro');

    let faceStatus = '';

    switch (code) {
      case 900:
        faceStatus = 'face-passed';
        break;
      case 901:
        faceStatus = '';
        break;
      default:
        faceStatus = 'face-found';
        break;
    }

    if (
      ovalElement.classList.contains('face-passed') &&
      faceStatus !== 'face-passed'
    ) {
      ovalElement.classList.remove('face-passed');
    }

    if (
      ovalElement.classList.contains('face-found') &&
      faceStatus !== 'face-found'
    ) {
      ovalElement.classList.remove('face-found');
    }

    if (faceStatus !== '' && !ovalElement.classList.contains(faceStatus)) {
      ovalElement.classList.add(faceStatus);
    }
  };

  function traducirMensajeError(detectorFeedbackObject) {
    const mensajes = traducciones;

    const mensaje = detectorFeedbackObject.feedback.message;

    const resultado = detectorFeedbackObject.result;

    if (resultado === 'FAIL' && mensaje in mensajes) {
      return mensajes[mensaje];
    } else {
      console.error(`No se pudo traducir el mensaje '${mensaje}'`);
      return '';
    }
  }

  async function enviarImagenBase64(imagenBase64) {
    return imagenBase64;

    try {
      const url = 'http://localhost:3000/verificar-rostro';

      const data = {
        imagen: imagenBase64,
      };

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'json',
      };

      const response = await axios.post(url, data, config);
    } catch (error) {
      if (error.response) {
        console.error(
          `Error ${error.response.status}: ${error.response.data.error}`
        );
      } else {
        console.error(`Error de red: ${error.message}`);
      }
    }
  }

  const calcularDimencionesOvalo = (cameraWidth, cameraHeight) => {
    const ovalAspectRatio = 3 / 4;
    const cameraAspectRatio = cameraWidth / cameraHeight;

    let ovalWidth, ovalHeight, ovalLeft, ovalTop;

    if (ovalAspectRatio > cameraAspectRatio) {
      ovalWidth = (cameraWidth * 65) / 100;
      ovalHeight = ovalWidth / ovalAspectRatio;
    } else {
      ovalHeight = (cameraHeight * 70) / 100;
      ovalWidth = ovalHeight * ovalAspectRatio;
    }

    ovalLeft = (cameraWidth - ovalWidth) / 2;
    ovalTop = (cameraHeight - ovalHeight) / 2;

    const ovalStyle = {
      width: `${ovalWidth}px`,
      height: `${ovalHeight}px`,
      left: `${ovalLeft}px`,
      top: `${ovalTop}px`,
    };

    return ovalStyle;
  };

  function asignarDimencionesOvalo() {
    const videoContainer = document.getElementById('video-container');

    if (videoContainer === null) {
      console.warn('No se ha encontrado el contenedor del video');
      return;
    }

    const containerWidth = videoContainer.offsetWidth;
    const containerHeight = videoContainer.offsetHeight;

    const ovalStyles = calcularDimencionesOvalo(
      containerWidth,
      containerHeight
    );

    const ovalElement = document.getElementById('oval-rostro');

    ovalElement.style.height = ovalStyles.height;
    ovalElement.style.top = ovalStyles.top;
    ovalElement.style.width = ovalStyles.width;
    ovalElement.style.left = ovalStyles.left;
  }

  function resizeOvaloOnResize() {
    if (resizingOvalo) return;

    window.addEventListener('resize', asignarDimencionesOvalo);
    resizingOvalo = true;
  }

  function stopResizeOvaloOnResize() {
    if (!resizingOvalo) return;

    window.removeEventListener('resize', asignarDimencionesOvalo);
    resizingOvalo = false;
  }

  return {
    pasos,
    resizingOvalo,

    asignarDimencionesOvalo,
    enviarImagenBase64,
    iniciarCamara,
    findFace,
    resizeOvaloOnResize,
    stopResizeOvaloOnResize,
  };
})();
