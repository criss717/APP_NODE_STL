import { useState } from 'react'
import './App.css'
import Form from './Components/Form/Form'
import ReactPlayer from 'react-player';
import NavBar from './Components/NavBar/NavBar';


function App() { 
   
  return (
    <div className='d-flex flex-column vw-100 vh-100 align-items-center'>        
     
      <NavBar/>     
      <div className='videoBackground'>
        <ReactPlayer
          url="file.mp4"
          playing={true}
          loop={true}
          muted={true}          
          style={{ position: 'fixed'}}
          config={{
            file: {
              attributes: { 
                style: {
                  objectFit: 'cover', //para q ocupe todo el contenido asi se deforme
                },
              },
            },
          }}
        />
      </div> 
      <div className='form'>
        <Form/> 
      </div>

    </div>
  )
}

export default App
