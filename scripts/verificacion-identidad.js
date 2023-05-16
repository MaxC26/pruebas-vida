const VerificacionIdentidad = (() => {
  const pasos = Helpers.pasos;

  const btnIniciarCamara = document.querySelector('#btn-tomar-foto-rostro');

  btnIniciarCamara.addEventListener('click', async () => {
    try {
      const modalVerificacion = new bootstrap.Modal(
        document.getElementById('modal-verificacion')
      );
      modalVerificacion.show();
    } catch (e) {
      $('#modal-verificacion').modal('show');
    }

    await CapturaRostro.iniciarCamara();

    setTimeout(() => {
      CapturaRostro.findFace();
    }, 3000);
  });

  CapturaRostro.resizeOvaloOnResize();

  function asignarDimencionOvaloInterval() {
    const interval = setInterval(() => {
      const videoContainer = document.getElementById('video-container');

      if (videoContainer === null) {
        console.warn('No se ha encontrado el contenedor del video');
        return;
      }

      if (videoContainer.offsetWidth > 0 && videoContainer.offsetHeight > 0) {
        CapturaRostro.asignarDimencionesOvalo(
          videoContainer.offsetWidth,
          videoContainer.offsetHeight
        );
        clearInterval(interval);
      }
    }, 200);
  }

  asignarDimencionOvaloInterval();

  async function volverTomarFotoRostro() {
    Helpers.mostrarPaso(pasos.CAPTURAR_ROSTRO);

    asignarDimencionOvaloInterval();

    CapturaRostro.resizeOvaloOnResize();

    await CapturaRostro.iniciarCamara();

    CapturaRostro.findFace();
  }

  async function confirmarFotoRostro() {
    const imagenBase64 = document.querySelector('#img-captura-rostro').src;

    const response = await CapturaRostro.enviarImagenBase64(imagenBase64);

    Helpers.mostrarPaso(pasos.SELECCIONAR_DOCUMENTO);
  }

  async function confirmarFotoDocFrontal() {
    let documento = Helpers.documentoSeleccionado;

    if (documento === 'dui') {
      Helpers.mostrarPaso(pasos.CAPTURAR_DOCUMENTO_POSTERIOR, documento);
      CapturaDocumento.resizeCanvasOnResize();

      const result = await CapturaDocumento.iniciarCapturaDocumento();

      Helpers.mostrarPaso(
        pasos.CONFIRMAR_FOTO_DOCUMENTO_POSTERIOR,
        result.documentImage
      );
    } else {
      Helpers.mostrarPaso(pasos.SPINNER_VERIFICACION, documento);

      const response = await Helpers.fetchProcesarIdentidad();

      if (response?.success === 'ok') {
        Helpers.mostrarPaso(pasos.VERIFICACION_EXITOSA);
      } else {
        Helpers.mostrarPaso(pasos.VERIFICACION_FALLIDA);
      }
    }
  }

  async function tomarFotoDocFrontal(documento) {
    Helpers.mostrarPaso(pasos.CAPTURAR_DOCUMENTO_FRONTAL, documento);
    CapturaDocumento.resizeCanvasOnResize();

    const result = await CapturaDocumento.iniciarCapturaDocumento();

    if (result) {
      Helpers.mostrarPaso(
        pasos.CONFIRMAR_FOTO_DOCUMENTO_FRONTAL,
        result.documentImage
      );
    } else {
      console.error('No se obtuvieron las imagenes del documento');
      Helpers.mostrarPaso(pasos.CAPTURAR_DOCUMENTO_FRONTAL);
    }
  }

  async function seleccionarDocumento(documento) {
    Helpers.documentoSeleccionado = documento;

    await tomarFotoDocFrontal(documento);
  }

  async function volverTomarFotoDocFrontal(documento) {
    CapturaDocumento.resizeCanvasOnResize();

    await tomarFotoDocFrontal(documento);
  }

  async function volverTomarFotoDocPosterior(documento) {
    Helpers.mostrarPaso(pasos.CAPTURAR_DOCUMENTO_POSTERIOR, documento);
    CapturaDocumento.resizeCanvasOnResize();

    const result = await CapturaDocumento.iniciarCapturaDocumento();

    if (result) {
      Helpers.mostrarPaso(
        pasos.CONFIRMAR_FOTO_DOCUMENTO_POSTERIOR,
        result.documentImage
      );
    } else {
      console.error('No se obtuvieron las imagenes del documento');
      Helpers.mostrarPaso(pasos.CAPTURAR_DOCUMENTO_POSTERIOR);
    }
  }

  async function confirmarFotoDocPosterior(documento) {
    Helpers.mostrarPaso(pasos.SPINNER_VERIFICACION, documento);

    const response = await Helpers.fetchProcesarIdentidad();

    if (response?.success === 'ok') {
      Helpers.mostrarPaso(pasos.VERIFICACION_EXITOSA);
    } else {
      Helpers.mostrarPaso(pasos.VERIFICACION_FALLIDA);
    }
  }

  function reintentarVerificacion() {
    location.reload();
  }

  function activarCda() {
    window.location.href = `${window.location.origin}/activar-cda`;
  }

  function portarNumero() {
    window.location.href = `${window.location.origin}/portabilidad`;
  }

  function recuperarNumero() {
    window.location.href = `${window.location.origin}/recuperar-numero`;
  }

  return {
    volverTomarFotoRostro,
    confirmarFotoRostro,
    confirmarFotoDocFrontal,
    seleccionarDocumento,
    volverTomarFotoDocFrontal,
    volverTomarFotoDocPosterior,
    confirmarFotoDocPosterior,
    reintentarVerificacion,
    activarCda,
    portarNumero,
    recuperarNumero,
  };
})();
