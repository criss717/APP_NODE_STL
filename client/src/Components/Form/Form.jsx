import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js'; // Ruta correcta para importar STLLoader
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Table from '../Table/Table';
import Colors from '../Colors/Colors';
import s from '../Form/Form.module.css'
import DropZone from '../DropZone/DropZone';
import Placeholders from '../PlaceHolder/PlaceHolder';

const Form = () => {
  // Estados
  const [inputFile, setInputFile] = useState(undefined); //para guardar archivo stl
  const [inputPrice, setInputPrice] = useState(30) //para almacenar precio x Kg
  const [dataStl, setDataStl] = useState({}) //para almacenar la data que llega del back del archivo stl
  const [colorModel, setColorModel] = useState('#ffc600') // para modificar el color por el usuario
  const [noValidate, setNoValidate] = useState(false)
  const [isSend, setIsSend] = useState(false)   //para renderizar spiners
  const [isAutoRotateEnabled, setIsAutoRotateEnabled] = useState(true); // para cancelar animacion automatica
  
  //creacion de escenas y camara
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  );

  //espacio para renderizar
  const renderer = new THREE.WebGLRenderer({ alpha: true }); //alpha deja el fondo del espacio 3D en transparente

  if (window.innerWidth < 500) { //para ajustar tamaño pantalla
    renderer.setSize(300, 300)
  } else {
    renderer.setSize(400, 400)
  }

  const objectRef = useRef(); // para crear una referencia al objeto
  const animateRef = useRef(); // para que no se aumente la velocidad con cada render

  // inicializar la visualizacion del espacio 3D 
  function init() {
    scene.add(objectRef.current); // añadimos el objeto  

    // Ajusta la posición de la cámara y el objetivo de la órbita
    if (window.innerWidth < 500) { //para ajustar tamaño pantalla
      camera.position.set(0, 0, 110);
    } else if (window.innerWidth < 800) {
      camera.position.set(0, 0, 80);
    } else camera.position.set(0, 0, 65);

    let controls = new OrbitControls(camera, renderer.domElement) //controls es para darle al usuario la posibilidad de hacer scrol y girar dentro de la escena
    controls.target.set(0, 0, 0); // Establece el objetivo al centro de la escena
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;

    //agregar luces
    let light = new THREE.DirectionalLight(0xffffff)
    light.position.set(-25, -30, 10)
    scene.add(light)

    let light2 = new THREE.DirectionalLight(0xffffff)
    light2.position.set(-25, -30, 10)
    scene.add(light2)
    renderer.render(scene, camera); // dibuja la escena en el espacio div
    animate()
  }

  function animate() { //para que gire automatico    
    if (objectRef.current && isAutoRotateEnabled) {
      objectRef.current.rotation.y += 0.01;
    }
    renderer.render(scene, camera); // dibuja la escena en el espacio div
    animateRef.current = requestAnimationFrame(animate); // solicita el siguiente cuadro de animación, debe ser así para que no aumente la velocidad con cada renderización
  }

  useEffect(() => {
    if (inputFile) {      
      console.log(inputFile);
      let loader = new STLLoader();
      loader.load(URL.createObjectURL(inputFile), (model) => {
        const newObject = new THREE.Mesh(
          model,
          new THREE.MeshLambertMaterial({ color: colorModel })
        );
        newObject.scale.set(1, 1, 1);
        newObject.position.set(0, 0, 0);
        newObject.geometry.center(); // Ajusta el centro de masa, para que gire en su propio eje         

        objectRef.current = newObject; //asigna un nuevo objeto a la referencia
        const renderModelHTML = document.getElementById('stl-preview');
        renderModelHTML.innerHTML = '' //limpiamos lo que hay de antes
        renderModelHTML.appendChild(renderer.domElement); //montamos el nuevo
        init();
      });
    }

    (function () { //codigo para validar form bootrap 5   
      'use strict'

      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.querySelectorAll('.needs-validation')

      // Loop over them and prevent submission
      Array.prototype.slice.call(forms)
        .forEach(function (form) {
          form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
              event.preventDefault()
              event.stopPropagation()
              setNoValidate(true) // establecemos en true si hay alguna invalidada
            }
            form.classList.add('was-validated')
          }, false)
        })
    })()

    return () => {      
      // Limpiar el bucle de animación al desmontar el componente
      cancelAnimationFrame(animateRef.current);
    };
  }, [colorModel, isAutoRotateEnabled,inputFile])
  
  useEffect(()=>{
    setIsAutoRotateEnabled(true) // para que cada q cambie de archivo activar el automatico giro
    if (inputFile) {
      if (isSend) {
        setIsSend(false) // para ocultar la tabla en caso q  el user cambie de archivo
        setDataStl({}) //limpiamos los datos del anterior archivo
      }
    }  
  },[inputFile])
  // Handlers
  const handlerSubmit = async (e) => {
    setIsSend(true) // ponemos en true para renderizar tabla o el placeHolder
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('stlFile', inputFile); // pone el archivo deleccionado en un form estilo objeto con propiedad llamada stlFile y valor: inputValue
      const { data } = await axios.post('https://node-stol-back.onrender.com/upload', formData);
      console.log(data);
      setDataStl({
        weight: data.weight,
        volume: data.volume,
        area: data.area,
        boundingBox: data.boundingBox
      })
    } catch (error) {
      console.log(error);
    }
  };

  const handlerStopAndPlayAnimation = () => {
    isAutoRotateEnabled ? setIsAutoRotateEnabled(false) : setIsAutoRotateEnabled(true)   
  }

  const handlerInputPrice = (e) => {
    const { value } = e.target
    setInputPrice(value)
  }

  return (
    <div className={`container ${s.container}`}>
      <form className={`mt-2 form-control needs-validation ${s.containerForm}`} onSubmit={(e) => handlerSubmit(e)} noValidate >
        <div className='col-12 mb-2'>
          <input value={inputFile && inputFile.name} type="text" className='d-none' required /> {/*la oculto para aprovechar el validate*/}
          <DropZone setInputFile={setInputFile} noValidate={noValidate} />
          <div className="invalid-feedback text-end" style={{ fontWeight: "bold" }}>Required file</div>
        </div>

        <div className='row mb-2'>
          <label className='col-7 col-sm-9 col-md-10 col-xl-9 col-form-label text-end' style={{ color: "black", fontWeight: "bold" }} htmlFor='input-price'>Price x Kg (€)</label>
          <div className={`col-sm-3 col-5 col-md-2 col-xl-3`}>
            <input
              type='number'
              className='form-control'
              id='input-price'
              required
              min={1}
              onChange={(e) => handlerInputPrice(e)}
              value={inputPrice}
            />
            <div className="invalid-feedback text-end" style={{ fontWeight: "bold" }}>Value greater than 0</div>
          </div>
        </div>
        <div className='col-12 text-end'>
          <button className='btn btn-dark' type="submit">
            {
              dataStl.weight || !isSend ?
                <span>Calculate</span>
                : <div className={`spinner-border ${s.spinner}`}role="status"></div>
            }
          </button>
        </div>
      </form>
      <div className={`d-flex flex-column align-items-center`}>
        <div className={s.divModel}>
          <div id="stl-preview"></div>
          {
            objectRef.current && (
              <div className={`${s.divColors}`}>
                <button className={`btn btn-dark ${s.buttonStopAndPlay}`} onClick={() => handlerStopAndPlayAnimation()}>
                  {
                    isAutoRotateEnabled? <i className="bi bi-stop-fill"></i> 
                    : <i className="bi bi-play-fill"></i>
                  }              
                </button>            
                <Colors setColorModel={setColorModel} />            
              </div>
            )
          }
        </div>

        <div className={`d-flex flex-column col-12 col-sm-11 align-items-center ${s.divTable}`}>
          {isSend &&
            (dataStl.weight ?
              <Table dataStl={dataStl} inputPrice={inputPrice} />
              : <Placeholders />)
          }
        </div>

      </div>
    </div>
  );
};

export default Form;