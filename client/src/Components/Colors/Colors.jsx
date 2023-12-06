import React from 'react';
import { HuePicker } from 'react-color';

class Colors extends React.Component {
    constructor(props){
        super(props)
        
        this.state= {
            background: '#00ff00',            
        }                
    }    

    handleChangeComplete = (color) => {             
        this.props.setColorModel(color.hex)
        this.setState({ background: color.hex });
    };

    render() {
        return (
        <HuePicker
            color={ this.state.background }
            onChangeComplete={ this.handleChangeComplete }
            styles={{ default: { width: '100%' } }} // Añade estilos para ajustar el ancho
        />
        );
    }
}

export default Colors
