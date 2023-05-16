const CapturaDocumento = (function () {
  let dc = null;
  let resizingCanvas = false;
  let aspectRatio = null;

  let modulosCargados = false;
  let camaraIniciada = false;

  const baseUrl = Helpers.obtenerURLBase();

  const traducciones = {
    900: 'Mantén durante unos segundos',
    901: 'Posiciona el documento de manera que llene el rectángulo',
    902: 'Alinea tu documento con el rectángulo en la pantalla',
    903: 'Intenta enderezar el documento',
    904: 'Intenta enderezar el documento',
    905: 'Intenta enderezar el documento',
    906: 'Aleja el documento de la luz fuerte',
    907: 'Intenta capturar el documento sobre un fondo liso',
    908: 'Intenta enderezar el documento',
    909: 'Intenta mantener el documento en una posición estable',
    910: 'Por favor, posiciona el documento dentro del área marcada',
    911: 'Aleja el documento de la luz fuerte',
    912: 'Se requiere una imagen de mejor calidad: por favor, captúrala nuevamente',
  };

  const coloresBorde = Object.freeze({
    DOCUMENTO_APROBADO: '#66cb9f',
    DOCUMENTO_NO_ENCONTRADO: '#f16063',
    DOCUMENTO_ENCONTRADO: '#fac109',
  });

  function iniciarConfiguracion() {
    console.log(Helpers.documentoSeleccionado);

    if (Helpers.documentoSeleccionado !== 'pasaporte') {
      documentType = 'PASSPORT';
      aspectRatio = 1.42;
    } else {
      documentType = 'ID_CARD';
      aspectRatio = 1.58;
    }

    const configuration = {
      width: 1920,
      height: 1080,
      documentType,
    };

    dc = new Daon.DocumentCapture(configuration);
  }

  async function loadWasmModulesAsync() {
    return new Promise((resolve, reject) => {
      dc.loadWasmModules({
        urlIDDetectorWasm: baseUrl + '/scripts/DaonDocument/DaonIDCapture.wasm',

        onIDModuleInited: ({ isLoaded, error }) => {
          isLoaded && resolve(true);
          error && reject(error);
        },
        shouldSaveUnprocessed: true,
        nPassedFrames: 2,
      });
    });
  }

  async function cargarModulos() {
    if (modulosCargados) {
      return;
    }

    iniciarConfiguracion();

    try {
      await loadWasmModulesAsync();

      modulosCargados = true;
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 5000));

      return await cargarModulos();
    }
  }

  async function startCameraAsync(video, canvasEl, aspectRatio) {
    return new Promise((resolve, reject) => {
      dc.startCamera({
        targetVideo: video,
        overlayCanvas: canvasEl,
        aspectRatio,
      })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async function iniciarCamara() {
    if (camaraIniciada) {
      return;
    }

    try {
      const videoEl = document.getElementById('video-documento');
      const canvasEl = document.getElementById('canvas-documento');

      const response = await startCameraAsync(videoEl, canvasEl, aspectRatio);

      camaraIniciada = true;
    } catch (error) {}
  }

  async function startIDDetectorAsync(aspectRatio) {
    return new Promise((resolve, reject) => {
      dc.startIDDetector({
        onIDDetectorInitialized: function () {
          dc.setBarcodeScan(false);
          dc.searchForDocument(aspectRatio);
        },

        onIDDetectorError: function (coordinates, err) {
          reject(err);
        },

        onIDDetection: function (documentImage, coordinates, qualityScore, unprocessedImage) {
          if (documentImage && documentImage !== 'data:') {
            resolve({ documentImage, unprocessedImage });
          }
        },
        nPassedFrames: 2,
      });
    });
  }

  async function iniciarIDDetector() {
    try {
      const { documentImage, unprocessedImage } = await startIDDetectorAsync(aspectRatio);
      // Código a ejecutar cuando se detecte el documento correctamente

      stopCamera();

      return { documentImage, unprocessedImage };
    } catch (error) {
      // Se indica que no se ha detectado el documento cambiando el color del borde del canvas
      cambiarColorBorde(coloresBorde.DOCUMENTO_NO_ENCONTRADO);

      // Manejo de errores si ocurre algún problema durante la detección del documento

      if (error.code === undefined) {
        return;
      }

      // Se traduce el mensaje de error
      const mensaje = traducirMensajeError(error);

      const feedbackElement = document.getElementById('feedback');

      // Se muestra el error en pantalla si es diferente al anterior
      if (mensaje !== feedbackElement.innerText) {
        feedbackElement.innerText = mensaje;
      }

      // Se esperan 500 milisegundos antes de reiniciar la detección del documento
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Se debe reiniciar la detección del documento
      return await iniciarIDDetector();
    }
  }

  // Función para capturar el documento
  function capture() {
    findDocument();
  }

  // Función para detener la cámara
  function stopCamera() {
    camaraIniciada = false;
    dc.stopCamera();
  }

  // Retorna la imagen del documento
  function findDocument() {
    dc.searchForDocument(aspectRatio);
  }

  // Traduce el mensaje de error
  function traducirMensajeError(mensaje) {
    const { code } = mensaje;

    return traducciones[code] || 'Ha ocurrido un error, refresque la página';
  }

  // El ancho y alto del video deben ser iguales al del canvas, por eso se debe establecer el tamaño del video también.
  function setCanvasDimensions() {
    const video = document.getElementById('video-documento');
    const canvasEl = document.getElementById('canvas-documento');
    const { clientWidth, clientHeight } = document.getElementById('container-video-documento');

    video.width = clientWidth;
    video.height = clientHeight;
    canvasEl.height = clientHeight;
    canvasEl.width = clientWidth;
  }

  // Cambiar el color del borde del canvas
  function cambiarColorBorde(color) {
    dc.setStrokeStyle(color);
  }

  // Función para iniciar el proceso de captura del documento
  async function iniciarCapturaDocumento() {
    try {
      // Se debe asignar el tamaño del canvas antes de iniciar la cámara
      setCanvasDimensions();

      await cargarModulos();

      await iniciarCamara();

      // Se verifica si la cámara se ha iniciado correctamente y los módulos se han cargado correctamente, para verificar si se puede iniciar el detector de documentos
      if (!camaraIniciada || !modulosCargados) {
        return;
      }

      return await iniciarIDDetector();
    } catch (error) {
      console.error(error);
    }
  }

  function resizeCanvasOnResize() {
    if (resizingCanvas) return;

    window.addEventListener('resize', setCanvasDimensions);
    resizingCanvas = true;
  }

  function stopResizeCanvasOnResize() {
    if (!resizingCanvas) return;

    window.removeEventListener('resize', setCanvasDimensions);
    resizingCanvas = false;
  }

  return {
    capture,
    iniciarCapturaDocumento,
    stopCamera,
    resizeCanvasOnResize,
    stopResizeCanvasOnResize,
  };
})();
