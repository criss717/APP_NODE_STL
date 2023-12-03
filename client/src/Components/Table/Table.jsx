import React from 'react'

function Table({dataStl}) {
  return (
    <div className='table-responsive'>
        <table className='table table-dark table-hover'>
            <thead className='table-secondary'>
                <tr>
                    <th>Parametro</th>
                    <th>Valor</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Peso</td>
                    <td>{dataStl.weight}</td>
                </tr>
                <tr>
                    <td>Volume</td>
                    <td>{dataStl.volume}</td>
                </tr>
                <tr>
                    <td>Area</td>
                    <td>{dataStl.area}</td>
                </tr>
                <tr>
                    <td>Bounding-Box</td>
                    <td>{dataStl.boundingBox}</td>
                </tr>
                <tr>
                    <td>Price</td>
                    <td>
                        <button className='btn btn-light'>Calculate cost</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
  )
}

export default Table
