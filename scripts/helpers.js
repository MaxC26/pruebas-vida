const Helpers = (() => {
  const modalBody = document.querySelector('#modal-verificacion-body');
  
  let documentoSeleccionado = null;

  const pasos = Object.freeze({
    CAPTURAR_ROSTRO: 1,
    CONFIRMAR_FOTO_ROSTRO: 2,
    SELECCIONAR_DOCUMENTO: 3,
    CAPTURAR_DOCUMENTO_FRONTAL: 4,
    CONFIRMAR_FOTO_DOCUMENTO_FRONTAL: 5,
    CAPTURAR_DOCUMENTO_POSTERIOR: 6,
    CONFIRMAR_FOTO_DOCUMENTO_POSTERIOR: 7,
    SPINNER_VERIFICACION: 8,
    VERIFICACION_EXITOSA: 9,
    VERIFICACION_FALLIDA: 10,
  });

  function cambiarTituloPaso(paso) {
    let titulo = '';

    switch (paso) {
      case pasos.CAPTURAR_ROSTRO:
      case pasos.CONFIRMAR_FOTO_ROSTRO:
        titulo = 'Captura facial';
        break;

      case pasos.SELECCIONAR_DOCUMENTO:
        titulo = 'Captura de documento';
        break;

      case pasos.CAPTURAR_DOCUMENTO_FRONTAL:
      case pasos.CONFIRMAR_FOTO_DOCUMENTO_FRONTAL:
        titulo = 'Captura de documento frontal';
        break;

      case pasos.CAPTURAR_DOCUMENTO_POSTERIOR:
      case pasos.CONFIRMAR_FOTO_DOCUMENTO_POSTERIOR:
        titulo = 'Captura de documento trasera';
        break;

      case pasos.SPINNER_VERIFICACION:
      case pasos.VERIFICACION_EXITOSA:
      case pasos.VERIFICACION_FALLIDA:
        titulo = 'Verificando identidad';
        break;

      default:
        titulo = '';
        console.error('No se ha encontrado el paso');
        break;
    }

    const tituloPasoElement = document.getElementById(
      'modal-verificacion-label'
    );
    tituloPasoElement.innerText = titulo;
  }

  function cambiarBackgroundColorPaso(paso) {
    let backgroundColor = '';

    switch (paso) {
      case pasos.CONFIRMAR_FOTO_ROSTRO:
      case pasos.CONFIRMAR_FOTO_DOCUMENTO_FRONTAL:
      case pasos.CONFIRMAR_FOTO_DOCUMENTO_POSTERIOR:
        backgroundColor = '#000000';
        break;
      default:
        backgroundColor = '#FFFFFF';
    }

    const modalBodyElement = document.getElementById('modal-verificacion-body');
    modalBodyElement.style.backgroundColor = backgroundColor;
  }

  function mostrarPaso(paso, parametros = null) {
    const modalBody = document.querySelector('#modal-verificacion-body');

    eliminarEventos();

    CapturaRostro.stopResizeOvaloOnResize();
    CapturaDocumento.stopResizeCanvasOnResize();

    asignarEventos(paso);

    cambiarTituloPaso(paso);

    cambiarBackgroundColorPaso(paso);

    switch (paso) {
      case pasos.CONFIRMAR_FOTO_ROSTRO:
        modalBody.innerHTML = TemplatesPasos.confirmacionFoto(parametros);
        break;
      case pasos.CAPTURAR_ROSTRO:
        modalBody.innerHTML = TemplatesPasos.tomarFotoRostro();
        break;
      case pasos.SELECCIONAR_DOCUMENTO:
        modalBody.innerHTML = TemplatesPasos.seleccionarDocumento();
        break;
      case pasos.CAPTURAR_DOCUMENTO_FRONTAL:
        modalBody.innerHTML = TemplatesPasos.capturarDocumentoFrontal();
        break;
      case pasos.CONFIRMAR_FOTO_DOCUMENTO_FRONTAL:
        modalBody.innerHTML =
          TemplatesPasos.confirmarFotoDocumentoFrontal(parametros);
        break;
      case pasos.CAPTURAR_DOCUMENTO_POSTERIOR:
        modalBody.innerHTML = TemplatesPasos.capturarDocumentoPosterior();
        break;
      case pasos.CONFIRMAR_FOTO_DOCUMENTO_POSTERIOR:
        modalBody.innerHTML =
          TemplatesPasos.confirmarFotoDocumentoPosterior(parametros);
        break;
      case pasos.SPINNER_VERIFICACION:
        modalBody.innerHTML = TemplatesPasos.spinnerVerificacion();
        break;
      case pasos.VERIFICACION_EXITOSA:
        modalBody.innerHTML = TemplatesPasos.verificacionExitosa();
        break;
      case pasos.VERIFICACION_FALLIDA:
        modalBody.innerHTML = TemplatesPasos.verificacionFallida();
        break;

      default:
        modalBody.innerHTML = '<p>Se ha producido un error</p>';
        console.error('Paso no encontrado', paso);
        break;
    }
  }

  function eliminarEventos() {
    modalBody.removeEventListener('click', eventHandler);
  }

  async function eventHandler(event) {
    if (!event.target instanceof HTMLButtonElement) {
      return;
    }

    switch (event.target.id) {
      case 'btn-volver-tomar-foto-rostro':
        await VerificacionIdentidad.volverTomarFotoRostro();
        break;

      case 'btn-confirmar-foto-rostro':
        await VerificacionIdentidad.confirmarFotoRostro();
        break;

      case 'btn-seleccionar-dui':
        await VerificacionIdentidad.seleccionarDocumento('dui');
        break;

      case 'btn-seleccionar-pasaporte':
        await VerificacionIdentidad.seleccionarDocumento('pasaporte');
        break;

      case 'btn-seleccionar-carnet':
        await VerificacionIdentidad.seleccionarDocumento('carnet');
        break;

      case 'btn-volver-tomar-foto-doc-frontal':
        await VerificacionIdentidad.volverTomarFotoDocFrontal(
          VerificacionIdentidad.documentoSeleccionado
        );
        break;

      case 'btn-confirmar-foto-doc-frontal':
        await VerificacionIdentidad.confirmarFotoDocFrontal();
        break;

      case 'btn-volver-tomar-foto-doc-posterior':
        await VerificacionIdentidad.volverTomarFotoDocPosterior();
        break;

      case 'btn-confirmar-foto-doc-posterior':
        await VerificacionIdentidad.confirmarFotoDocPosterior();
        break;

      case 'btn-reintentar-verificacion':
        VerificacionIdentidad.reintentarVerificacion();
        break;

      case 'btn-activar-cda':
        VerificacionIdentidad.activarCda();
        break;

      case 'btn-portar-numero':
        VerificacionIdentidad.portarNumero();
        break;

      case 'bnt-recuperar-numero':
        VerificacionIdentidad.recuperarNumero();
        break;

      default:
        console.error('No se ha encontrado el botón', event.target.id);
    }
  }

  function asignarEventos() {
    modalBody.addEventListener('click', eventHandler);
  }

  function obtenerURLBase() {
    const urlCompleta = window.location.href;

    const urlSinArchivo = urlCompleta.substring(
      0,
      urlCompleta.lastIndexOf('/')
    );

    return urlSinArchivo.split('?')[0];
  }

  async function fetchProcesarIdentidad() {
    const response = {
      success: true,
      data: {
        test: 'test',
      },
    };

    await new Promise((resolve) => setTimeout(resolve, 3000));

    return response;
  }

  function recortarCadena(cadena, longitud) {
    if (cadena.length > longitud) {
      cadena = cadena.substring(0, longitud);
      cadena = cadena + '...';
    }
    return cadena;
  }

  function getPropertyByValue(obj, value) {
    for (let prop of Object.keys(obj)) {
      if (obj[prop] === value) {
        return prop;
      }
    }
  }

  return {
    pasos,
    documentoSeleccionado,
    mostrarPaso,
    recortarCadena,
    obtenerURLBase,
    fetchProcesarIdentidad,
  };
})();
