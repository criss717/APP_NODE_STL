import { useState } from 'react'
import './App.css'
import Form from './Components/Form/Form'
import ReactPlayer from 'react-player';

function App() { 
   
  return (
    <div className='app'>
      <div className='videoBackground'>
        <ReactPlayer
          url="file.mp4"
          playing={true}
          loop={true}
          muted={true}          
          style={{ position: 'fixed', top: 0, left: 0 }}
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
      <Form/>        
    </div>
  )
}

export default App
