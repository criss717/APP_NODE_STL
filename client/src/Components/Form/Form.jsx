import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js'; // Ruta correcta para importar STLLoader
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Table from '../Table/Table';
import Colors from '../Colors/Colors';

const Form = () => {
  // Estados
  const [inputFile, setInputFile] = useState(); //para guardar archivo stl
  const [inputPrice,setInputPrice]=useState('') //para almacenar precio x Kg
  const [dataStl, setDataStl] = useState({}) //para almacenar la data que llega del back del archivo stl
  const [colorModel,setColorModel]=useState('#54C857') // para modificar el color por el usuario
  
  // Handlers
  const handlerInputFile = (e) => {
    const fileStl = e.target.files[0];   
    setInputFile(fileStl);   
  };

  const handlersubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('stlFile', inputFile); // pone el archivo deleccionado en un form estilo objeto con propiedad llamada stlFile y valor: inputValue
      const {data}= await axios.post('http://localhost:3001/upload', formData);
      console.log(data);
      setDataStl({
        weight:data.weight,
        volume:data.volume,
        area:data.area,
        boundingBox:data.boundingBox        
      })
    } catch (error) {
      console.log(error);
    }
  };

  const handlerInputPrice=(e)=>{
    const {value}=e.target
    setInputPrice(value)
  }

  // renderización objeto stl
  let scene, camera, renderer, object;
  function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color('#f47373')
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    camera.position.z = 10;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(500, 500)
    //document.body.appendChild(renderer.domElement)
    const rederModelHTML= document.getElementById('stl-preview')
    rederModelHTML.appendChild(renderer.domElement)

    scene.add(object)
    
    // Ajusta la posición de la cámara y el objetivo de la órbita
    camera.position.set(0, 0, 100);
    let controls = new OrbitControls(camera, renderer.domElement)    
    controls.target.set(0, 0, 0); // Establece el objetivo al centro de la escena
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;

    //agregar luces
    let light= new THREE.DirectionalLight(0xffffff)
    light.position.set(-25,-30,10)
    scene.add(light)

    let light2= new THREE.DirectionalLight(0xffffff)
    light2.position.set(-25,-30,10)
    scene.add(light2)

    animate()    
  }

  function animate(){
    requestAnimationFrame(animate)
    if (object) {      
      object.rotation.z += 0.01;  
      object.rotation.x += 0.01   
    }    
    renderer.render(scene, camera); // dibuja el modelo en el espacio
  }
    
  useEffect(()=>{  
    console.log(colorModel);
    if(inputFile) {      
      let loader = new STLLoader();       
      loader.load(URL.createObjectURL(inputFile), (model) => {
        object = new THREE.Mesh(
          model,
          new THREE.MeshLambertMaterial({ color: colorModel })
        );
        object.scale.set(1, 1, 1);
        object.position.set(0,0,0)  
        object.geometry.center(); // Ajusta el centro de masa, para que gire en su propio eje  
       
        init() // inicializa la escena 3D
        // scene.remove(object)
      })  

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
            }
    
            form.classList.add('was-validated')
          }, false)
        })
    })()
  },[colorModel,inputFile])

  return (
    <div className='container'>
      <form className='mt-2 form-control needs-validation' onSubmit={(e)=>handlersubmit(e)} noValidate >
        <div className='col-12 mb-2'>
          <input className='form-control' onChange={(e) => handlerInputFile(e)} type="file" accept=".stl" required/>
          <div className="invalid-feedback">required field</div>
        </div>
        
        <div className='row mb-2'>
          <label className='col-8 col-form-label text-end' htmlFor='input-price'>Price x Kg (€)</label>
          <div className='col-4'>
            <input                
                type='number'
                className='form-control'              
                id='input-price'
                required  
                min={1} 
                onChange={(e)=>handlerInputPrice(e)}    
                value={inputPrice}    
            />
            <div className="invalid-feedback">value greater than 0</div>
          </div>
        </div>
        <div className='col-12 text-end'>
          <button className='btn btn-dark' type="submit">Submit</button>
        </div>
       
      </form>
      <div id="stl-preview"></div>
      <Table dataStl={dataStl} inputPrice={inputPrice}/>
      <Colors setColorModel={setColorModel}/>
    </div>
  );
};

export default Form;