export function Scoreboard({ scoreX, scoreO, icons }) {
    return (
      <div className='scoreboard'>
        <h2>Puntuación</h2>
        <div className="scores">
          <div>
            <p>Jugador {icons.X}:</p>
            <p>{scoreX}</p>
          </div> 
          <div>
            <p>Jugador {icons.O}:</p>
            <p>{scoreO}</p>
          </div>
        </div>
      </div>
    );
}