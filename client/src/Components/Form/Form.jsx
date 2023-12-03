import React, { useState } from 'react';
import axios from 'axios';
import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js'; // Ruta correcta para importar STLLoader
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Table from '../Table/Table';

const Form = () => {
  // Estados
  const [input, setInput] = useState();
  const [dataStl, setDataStl] = useState({ //para almacenar la data que llega del back del archivo stl
    weight:undefined,
    volume:undefined,
    area:undefined,
    boundingBox:undefined
  }) 
  
  // Handlers
  const handlerInputFile = (e) => {
    const fileStl = e.target.files[0];   
    let loader = new STLLoader();   
    setInput(fileStl);
    loader.load(URL.createObjectURL(fileStl), (model) => {
      object = new THREE.Mesh(
        model,
        new THREE.MeshLambertMaterial({ color: 0X00ff00 })
      );
      object.scale.set(1, 1, 1);
      object.position.set(0,0,0)  
      object.geometry.center(); // Ajusta el centro de masa, para que gire en su propio eje  
      
      init() // inicializa la escena 3D
    })  
  };

  const handlersubmit = async (e) => {
    try {
      e.preventDefault();
      const formData = new FormData();
      formData.append('stlFile', input);
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

  // renderización objeto stl
  let scene, camera, renderer, object, cube;
  function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2a003b)
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
      renderer.render(scene, camera); // dibuja el modelo en el espacio
    }    
  }

  return (
    <div className='container'>
      <form className='form-control row'>
        <div className='col-6'>
          <input onChange={(e) => handlerInputFile(e)} type="file" accept=".stl" />
        </div>
        
        <div className='text-center d-flex justify-content-center'>
          <label>Price x Kg</label>
          <input
              value={30}
              type='number'
          />
        </div>

        <button className='btn btn-dark' onClick={(e) => handlersubmit(e)} type="submit">Submit</button>
      </form>
      <div id="stl-preview"></div>
      <Table dataStl={dataStl}/>
    </div>
  );
};

export default Form;