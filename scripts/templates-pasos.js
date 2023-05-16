const TemplatesPasos = (function () {
    function tomarFotoRostro() {
        return `
       <div class='video-container w-100 h-100 position-relative' id='video-container'>
          <video src='' playsinline='' id='video-rostro' autoplay='autoplay' muted='muted'
                 loop='loop' class='video-rostro'>
            Your browser does not support the video tag.
          </video>
      
          <div id='oval-rostro' class='face-found oval'>
          </div>
        </div>
        <p id='feedback'>Por favor, centra tu rostro dentro del óvalo</p>
      `;
    }

    function confirmacionFoto(fotoBase64) {
        if (!fotoBase64) {
            throw new Error('No se ha recibido la foto de la captura facial');
        }

        return `
    <div class='container-fluid container-md'>
      <img id='img-captura-rostro' alt=''
           src='${fotoBase64}'
           class='img-fluid mx-auto d-block mt-4 img-preview-rostro'/>

      <div class='row mt-5'>
        <div class='col-12'>
          <p class='text-white text-md-center'>
            Asegúrate de que el rostro esté bien enfocado y de que la foto esté nítida antes de continuar
          </p>
        </div>
      </div>

      <div class="row my-5">
        <div class="col-12">
          <div class="row justify-content-center">
            <div class="col-11 col-md-4 mb-3">
              <button id="btn-volver-tomar-foto-rostro" class="btn btn-azul-outline shadow-none w-100 mb-3 mb-md-0">Volver a
                tomar foto
              </button>
            </div>
          </div>
          <div class="row justify-content-center">
            <div class="col-11 col-md-4">
              <button id="btn-confirmar-foto-rostro" class="btn btn-verde shadow-none w-100">Continuar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
    }

    function seleccionarDocumento() {
        return `
      <div class='container-fluid'>
        <div class='row'>
          <div class='col-12 col-md-6 mx-md-auto mt-3 mb-3 texto-gris'>
            <h1>Elige un documento</h1>
            <p>Selecciona el tipo de documento que deseas cargar</p>
          </div>
        </div>
      
        <div class="col-12 col-md-6 mx-md-auto">
          <button id='btn-seleccionar-dui' class='d-flex justify-content-between w-100 mb-4 btn-seleccionar-documento' data-documento='dui'>
            <span>
              DUI
            </span>
            <span><i class="fa-solid fa-chevron-right"></i></span>
          </button>
      
          <button id='btn-seleccionar-pasaporte' class='d-flex justify-content-between w-100 mb-4 btn-seleccionar-documento' data-documento='pasaporte'>
            <span>
              Pasaporte
            </span>
            <span><i class="fa-solid fa-chevron-right"></i></span>
          </button>
      
          <button id='btn-seleccionar-carnet' class='d-flex justify-content-between w-100 btn-seleccionar-documento' data-documento='carnet'>
            <span>
              Carnet de residente
            </span>
            <span><i class="fa-solid fa-chevron-right"></i></span>
          </button>
        </div>
      </div>
      `;
    }

    function capturarDocumentoFrontal() {
        return `
      <div class="video-container w-100 h-100 position-relative" id='video-container'>
        <div class="" id="container-video-documento">
          <video src='' id="video-documento" width="0" height="0" autoplay='autoplay' muted='muted' loop='loop'
                 playsinline=""></video>
          <canvas id="canvas-documento" height="0" width="0"></canvas>
        </div>
        <p id='feedback' class="contenendor-feedback">Por favor, posiciona el documento dentro del área marcada</p>
      </div>
    `;
    }

    function confirmarFotoDocumentoFrontal(fotoBase64) {
        if (!fotoBase64) {
            throw new Error('No se ha recibido la foto frontal del documento');
        }

        return `
      <div class='container-fluid container-md'>
        <img id='img-captura-doc-frontal' alt=''
             src='${fotoBase64}'
             class='img-fluid mx-auto d-block mt-4 img-preview-captura'/>
        
        <div class='row mt-5'>
          <div class='col-12'>
            <p class='text-white text-md-center'>
              Asegúrate de que la imagen captura del documento sea totalmete visible, nítida, que no esté borrosa ni tenga brillos y que el texto sea legible antes de continuar
            </p>
          </div>
        </div>
        
        <div class="row my-5">
          <div class="col-12">
            <div class="row justify-content-center">
              <div class="col-11 col-md-4 mb-3">
                <button id="btn-volver-tomar-foto-doc-frontal" class="btn btn-azul-outline shadow-none w-100 mb-3 mb-md-0">Volver a
                  tomar foto
                </button>
              </div>
            </div>
            <div class="row justify-content-center">
              <div class="col-11 col-md-4">
                <button id="btn-confirmar-foto-doc-frontal" class="btn btn-verde shadow-none w-100">Continuar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      `;
    }

    function capturarDocumentoPosterior() {
        return `
      <div class="video-container w-100 h-100 position-relative" id='video-container'>
        <div class="" id="container-video-documento">
          <video src='' id="video-documento" width="0" height="0" autoplay='autoplay' muted='muted' loop='loop'
                 playsinline=""></video>
          <canvas id="canvas-documento" height="0" width="0"></canvas>
        </div>
        <p id='feedback' class="contenendor-feedback">Por favor, posiciona el documento dentro del área marcada</p>
      </div>
      `;
    }

    function confirmarFotoDocumentoPosterior(fotoBase64) {
        if (!fotoBase64) {
            throw new Error('No se ha recibido la foto posterior del documento');
        }

        return `
      <div class='container-fluid container-md'>
        <img id='img-captura-doc-posterior' alt=''
             src='${fotoBase64}'
             class='img-fluid mx-auto d-block mt-4 img-preview-captura'/>
        
        <div class='row mt-5'>
          <div class='col-12'>
            <p class='text-white text-md-center'>
              Asegúrate de que la imagen captura del documento sea totalmete visible, nítida, que no esté borrosa ni tenga brillos y que el texto sea legible antes de continuar
            </p>
          </div>
        </div>
        
        <div class="row my-5">
          <div class="col-12">
            <div class="row justify-content-center">
              <div class="col-11 col-md-4 mb-3">
                <button id="btn-volver-tomar-foto-doc-posterior" class="btn btn-azul-outline shadow-none w-100 mb-3 mb-md-0">Volver a
                  tomar foto
                </button>
              </div>
            </div>
            <div class="row justify-content-center">
              <div class="col-11 col-md-4">
                <button id="btn-confirmar-foto-doc-posterior" class="btn btn-verde shadow-none w-100">Continuar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      `;
    }

    //FIXME: cambiar ruta de imagen
    function spinnerVerificacion() {
        return `
      <div class="d-flex align-items-center justify-content-center text-center h-100">
        <div class="col-10">
          <img src="https://activar.movistar.com.sv/cert/movato/assets/images/verificacion-identidad/Loading.gif" alt="Loading" class='img-fluid mb-5 icono-loading'>
    
          <p class="texto-gris mb-5 h1">Estamos verificando tu identidad</p>
    
          <p class="texto-gris mb-5 h5">No cierres esta página</p>
        </div>
      </div>
      `;
    }

    //FIXME: cambiar ruta de imagen
    function verificacionExitosa() {
        return `
      <div class='container-fluid'>
        <div class='row my-5'>
          <div class='col-12'>
            <img src='https://activar.movistar.com.sv/cert/movato/assets/images/verificacion-identidad/Correcto_2Regular.svg' alt='' class='img-fluid d-block mx-auto icono-mediano'>
          </div>
        </div>
      
        <div class='col-9 col-md-6 mb-5 mx-auto'>
          <p class='texto-azul h4 text-center m-0'>Juan Pérez tu identidad ha sido verificada</p>
        </div>
        
         <div class='col-11 col-md-6 mb-5 mx-auto'>
            <button id='btn-continuar-proceso' class='btn btn-verde shadow-none w-100'>Continuar
            </button>
        </div>
      </div>
    `;
    }

    //FIXME: cambiar ruta de imagen
    function verificacionFallida() {
        return `
    <div class='container-fluid'>
      <div class='row my-5'>
        <div class='col-12'>
          <img src='https://activar.movistar.com.sv/cert/movato/assets/images/verificacion-identidad/Cancelar_2Regular.svg' alt='' class='img-fluid d-block mx-auto icono-mediano'>
        </div>
      </div>
  
      <div class='col-11 col-md-4 mb-5 mx-auto'>
        <p class='texto-azul h4 text-center m-0'>Juan Pérez no hemos podido validar tu identidad</p>
      </div>
  
      <div class='col-11 col-md-4 mb-5 mx-auto'>
        <button id='btn-reintentar-verificacion' class='btn btn-verde shadow-none w-100'>Intentar nuevamente
        </button>
      </div>
    </div>
  `;
    }

    return {
        tomarFotoRostro,
        confirmacionFoto,
        seleccionarDocumento,
        capturarDocumentoFrontal,
        confirmarFotoDocumentoFrontal,
        capturarDocumentoPosterior,
        confirmarFotoDocumentoPosterior,
        spinnerVerificacion,
        verificacionExitosa,
        verificacionFallida,
    }
})();