import { useState, useEffect } from 'react'
// Se instala en la terminal npm i react-circular-progressbar para poder ver el componente de la grafica
// El buildStyles nos permite reescribir el css de la grafica
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
// Aca importo la hoja de estilos de la grafica circular
import "react-circular-progressbar/dist/styles.css"

const ControlPresupuesto = ({
        gastos,
        setGastos,
        presupuesto,
        setPresupuesto,
        setIsValidPresupuesto
    }) => {

    const [porcentaje, setPorcentaje] = useState(10)
    const [disponible, setDisponible] = useState(0)
    const [gastado, setGastado] = useState(0)

    useEffect(() => {
      const totalGastado = gastos.reduce( (total, gasto ) => gasto.cantidad + total, 0);
      const totalDisponible = presupuesto - totalGastado;

      // Calcular el porcentaje gastado
      const nuevoPorcentaje = (( ( presupuesto - totalDisponible ) / presupuesto  ) * 100).toFixed(2);

      
      setDisponible(totalDisponible)
      setGastado(totalGastado)

      //Se le coloca un setTimeout para que se pueda ver la animacion de la grafica
      setTimeout(() => {
        setPorcentaje(nuevoPorcentaje)
      }, 1500);
    }, [gastos])

    // Esta funcion nos permite retornar en formato moneda, sin mutar el arreglo origen
    const formatearCantidad = (cantidad) => {
        return cantidad.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
         })
    }

    const handleResetApp = () => {
        const resultado = confirm('¿Deseas reiniciar presupuesto y gastos?');

        if(resultado) {
            setGastos([])
            setPresupuesto(0)
            setIsValidPresupuesto(false)
        } 
    }

    return (
        <div className="contenedor-presupuesto contenedor sombra dos-columnas">
            <div>
                <CircularProgressbar
                    // Aca cambiamos los estilos de la grafica, dependiendo si esta en negativo o positivo
                    styles={buildStyles({
                        pathColor: porcentaje > 100 ? '#DC2626' : '#3B82F6',
                        trailColor: '#F5F5F5',
                        textColor: porcentaje > 100 ? '#DC2626' : '#3B82F6',
                    })}
                    value={porcentaje}
                    text={`${porcentaje}% Gastado`}
                />
            </div>

            <div className="contenido-presupuesto">
                <button
                    className="reset-app"
                    type="button"
                    onClick={handleResetApp}
                >
                    Resetear App
                </button>
                <p>
                    <span>Presupuesto: </span>{formatearCantidad(presupuesto)}
                </p>
                    {/* condidiciona si tiene saldo disponible < 0 y le coloca la clase segun el css establecido para ello */}
                <p className={`${disponible < 0 ? 'negativo' : '' }`}>
                    <span>Disponible: </span>{formatearCantidad(disponible)}
                </p>

                <p>
                    <span>Gastado: </span>{formatearCantidad(gastado)}
                </p>
            </div>
        </div>
    )
}

export default ControlPresupuesto
