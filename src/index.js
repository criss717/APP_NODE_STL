const express = require('express')
const axios = require('axios')
const NodeStl = require('node-stl') //para leer archivos .stl
const multer = require('multer') //para la carga de archivos del input
const path=require('path')
const cors = require('cors')

const PORT = 3001
const app = express()

app.use(express.json()) //midleware pasar datos a JSON
app.use(cors()) // problemas de cors
console.log(Date.now);

// Configuración de Multer para almacenar archivos en disco
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Especifica la carpeta donde se guardarán los archivos
        cb(null, 'public/');
    },
    filename: (req, file, cb) => {
        // Define el nombre del archivo (puedes personalizar esto según tus necesidades)
        cb(null,(file.originalname));
    },
});
const upload = multer({ storage: storage });

//funciona para dejar en max un decimar par ala bounding box
function fixedBox(data){      
    return data.map((elem)=>{
        let num=Number(elem)
        return num.toFixed(1)
    })
}

// Ruta de carga de archivos
app.post('/upload', upload.single('stlFile'), (req, res) => { //el midleware upload.single es para indicar que se recibirá un unico archivo y estara dentro del form stlFile
    const stlFile = req.file;
    console.log(stlFile, stlFile.path); 
    var stl = new NodeStl(stlFile.path, {density: 1.04}); // en stlFile.path esta la ruta del archivo
    console.log(stl.weight.toFixed(2) + 'g');       //  1g
    // Hacer algo con el archivo, por ejemplo, guardar la ruta en la base de datos
    res.json({ message: 'Archivo STL recibido y guardado con éxito',
        weight:`${stl.weight.toFixed(2)} (g)`,
        volume:`${stl.volume.toFixed(2)} (cm^3)`,
        area:`${stl.area.toFixed(2)} (m^2)`,
        boundingBox:`[${fixedBox(stl.boundingBox)}] (mm)`
    });
});



// var stl = new NodeStl(__dirname + '/myCool.stl', {density: 1.04});
// console.log(stl.volume + 'cm^3');     // 21cm^3
// console.log(stl.weight + 'gm');       //  1gm
// console.log(stl.boundingBox,'(mm)');  // [60,45,50] (mm)
// console.log(stl.area,'(m)');          // 91.26 (m)
// console.log(stl.centerOfMass,'(mm)'); // [30,22.5,25] (mm)
// console.log(stl.isWatertight ? 'STL is watertight' : 'STL is not watertight');



app.listen(PORT, () => {
    console.log(`server raised in port: ${PORT}`);
})
