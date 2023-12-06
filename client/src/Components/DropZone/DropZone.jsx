import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import s from '../DropZone/DropZone.module.css';

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16,
  border: '2px solid black',
};

function DropZone(props) {
  const [files, setFiles] = useState([]);
  const [noValidate,setNoValidate] = useState(false)
  
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/sla': ['.stl'],
    },
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
    },
  });

  const handleButtonClick = () => {
    document.getElementById('fileInput').click(); //simula un click en el input<< cuadro de arrastre
  };

  useEffect(() => {
    if(props.noValidate) {
      setNoValidate(true)
    }     
    if (files.length > 0) {
      setNoValidate(false) // quitamos invalidez 
      const selectedFile = files[0];
      if (selectedFile) {
        if (selectedFile.name.endsWith('.stl')) {
          props.setInputFile(selectedFile);
        } else {
          // Archivo no cumple con las validaciones
          console.log('Por favor, seleccione un archivo .stl');
        }
      }
    }
    // Revocar data URIs para evitar pérdidas de memoria
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files, props]);

  return (
    <div className={`container ${s.container} ${noValidate&&s.containerInvalidate} ${files[0]&&s.containerWithFile} mb-2`}>
      <section>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} id="fileInput" />
          {!files[0] ? (
            <div>
              <p className={`${s.parrafo}`}>
                Drag 'n' drop some files here, or click to select files
              </p>
              <p className={`${s.parrafo}`}>(Only *.stl files will be accepted)</p>
            </div>
          ) : (
            <p className={`${s.parrafo}`}>
              <i className="bi bi-file-earmark-code"></i> {files[0].name}
            </p>
          )}
        </div>
        <aside style={thumbsContainer}></aside>
      </section>

      {/* Botón adicional para cargar archivos */}
      <button
        type="button"        
        className={`btn btn-dark mt-2`}
        onClick={handleButtonClick}
      >

        <i className="bi bi-cloud-upload-fill"></i> {files[0]?'Change 3D Model':'Update 3D Model'}
      </button>
    </div>
  );
}

export default DropZone;
