import './App.css'
import Form from './Components/Form/Form'
import ReactPlayer from 'react-player';
import NavBar from './Components/NavBar/NavBar';

function App() { 
   
  return (
    <div className='d-flex flex-column vw-100 vh-100 align-items-center app'>      
      <NavBar/>
      <div className='titleH2 text-center'>
        <h2 className='titleH2 m-0 p-0'>Upload your files to get an instant quote</h2>      
      </div>     
      <div className='videoBackground'>
        <ReactPlayer
          url="file.mp4"
          playing={true}
          loop={true}
          muted={true}   
          width={'100vw'} 
          height={'fit-content'}         
          config={{
            file: {
              attributes: { 
                style: {
                  objectFit: 'cover', //para q ocupe todo el contenido asi se deforme                  
                  width:'100vw',
                  height:'900px',                 
                  borderTop:'4px solid #ffc600'             
                },
              },
            },
          }}
        />
        <div className='col-10 col-lg-9 col-xl-6 col-xxl-4 form'>
          <Form/> 
        </div>
      </div> 
    </div>
  )
}

export default App
