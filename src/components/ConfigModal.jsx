import { ICONS } from '../constants.js'

export function ConfigModal ({ toggleModal }) {

    return (
      <section>
        <div className='text'>
          <h2>Configuración</h2>
  
          <header className='win'>
          
          </header>

          <footer>
            <button onClick={toggleModal}>Cerrar</button>
          </footer>

        </div>
      </section>
    )
}