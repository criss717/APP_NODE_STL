import React, { useEffect, useState } from 'react'

function Table({ dataStl, inputPrice }) {
    const [cost,setCost]=useState('')   

    useEffect(()=>{  
        console.log(inputPrice,dataStl.weight);             
        if(dataStl.weight && inputPrice) {
            const calculate=Number(inputPrice)* Number(dataStl.weight)/ 1000           
            setCost(calculate.toFixed(2))
        }
    },[inputPrice,dataStl])

    return (
        <div className='w-100 h-100 text-center'>
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
                        <td>Area (m)</td>
                        <td>{dataStl.area}</td>
                    </tr>
                    <tr>
                        <td>Bounding-Box (mm)</td>
                        <td>{dataStl.boundingBox}</td>
                    </tr>
                    <tr>
                        <td>Cost (€)</td>
                        <td>
                           {cost}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Table
