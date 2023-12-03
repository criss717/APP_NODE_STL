import React from 'react';
import { BlockPicker } from 'react-color';

class Colors extends React.Component {
    constructor(props){
        super(props)
        
        this.state= {
            background: '#fff',
        }                
    }    

    handleChangeComplete = (color) => {        
        this.props.setColorModel(color.hex)
        this.setState({ background: color.hex });
    };

    render() {
        return (
        <BlockPicker
            color={ this.state.background }
            onChangeComplete={ this.handleChangeComplete }
        />
        );
    }
}

export default Colors
