import React, { useEffect, useState } from 'react'

function Table({ dataStl, inputPrice }) {
    const [cost,setCost]=useState(0)
    //handlers
    const handlerCost=()=>{
        if(dataStl.weight && inputPrice) {
            const calculate=Number(inputPrice)* Number(dataStl.weight)/ 1000           
            setCost(calculate.toFixed(2))
        }
    }

    useEffect(()=>{
        setCost(0) //cada que el valor del precio cambie, ponemos el calculo en cero y asi se renderiza de nuevo el boton de calcular price
    },[inputPrice])

    return (
        <div className='table-responsive'>
            <table className='table table-dark table-hover'>
                <thead className='table-secondary'>
                    <tr>
                        <th>Parameter</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Weight (g)</td>
                        <td>{dataStl.weight}</td>
                    </tr>
                    <tr>
                        <td>Volume (cm^3)</td>
                        <td>{dataStl.volume}</td>
                    </tr>
                    <tr>
                        <td>Area (m^2)</td>
                        <td>{dataStl.area}</td>
                    </tr>
                    <tr>
                        <td>Bounding-Box (mm)</td>
                        <td>{dataStl.boundingBox}</td>
                    </tr>
                    <tr>
                        <td>Cost (€)</td>
                        <td>
                           {
                            cost===0?<button onClick={() => handlerCost()} className='btn btn-light'>Calculate cost</button>
                            :cost
                           } 
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Table
