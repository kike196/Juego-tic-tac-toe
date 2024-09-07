import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'

import { Square } from './components/Square.jsx'
import { ICONS } from './constants.js'
import { checkWinnerFrom, checkEndGame } from './logic/board.js'
import { WinnerModal } from './components/WinnerModal.jsx'
import { saveGameToStorage, resetGameStorage } from './logic/storage/index.js'
import { Scoreboard } from './components/Score.jsx'
import { ConfigModal } from './components/ConfigModal.jsx'

function App () {
  // historial de ganadores
  const [scoreX, setScoreX] = useState(0);
  const [scoreO, setScoreO] = useState(0);

  const resetScore = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
    setScoreX(0)
    setScoreO(0)

    resetGameStorage()
  }

  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    if (boardFromStorage) return JSON.parse(boardFromStorage)
    return Array(9).fill(null)
  })

  const [icons, setIcons] = useState(0);

  const iconsHandleClick = () => {

    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)

    resetGameStorage()

    if (icons <= ICONS[0].length) {
      setIcons(icons + 1);
    } else {
      setIcons(0);
    }
  };

  const TURNS = { // los iconos que se muestran
    X: ICONS[icons][0],
    O: ICONS[icons][1]
  }

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn');
    return turnFromStorage ?? ICONS[icons][0];
  });
  
  useEffect(() => {
    setTurn(ICONS[icons][0]); 
  }, [icons]);

  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  // null es que no hay ganador, false es que hay un empate
  const [winner, setWinner] = useState(null)

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)

    resetGameStorage()
  }

  const updateBoard = (index) => {
    // no actualizamos esta posición
    // si ya tiene algo
    if (board[index] || winner) return
    // actualizar el tablero
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)
    // cambiar el turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)
    // guardar aqui partida
    saveGameToStorage({
      board: newBoard,
      turn: newTurn
    })
    // revisar si hay ganador
    const newWinner = checkWinnerFrom(newBoard)
    if (newWinner) {
      confetti();
      if (newWinner === TURNS.X) {
        setScoreX(scoreX + 1);
      } else if (newWinner === TURNS.O) {
        setScoreO(scoreO + 1);
      }
      setWinner(newWinner);
    } else if (checkEndGame(newBoard)) {
      setWinner(false); // empate
    }
    
  }

  return (
    <main className='board'>

      <section>
        <button onClick={resetScore}>Reset historial</button>
        <Scoreboard scoreX={scoreX} scoreO={scoreO} icons={TURNS} />
      </section>

      <section className='board'>
        <section className='game'>
          {
            board.map((square, index) => {
              return (
                <Square
                  key={index}
                  index={index}
                  updateBoard={updateBoard}
                >
                  {square}
                </Square>
              )
            })
          }
        </section>
      </section>

      <section>
        <button onClick={resetGame}>Reset del juego</button>

        <button onClick={toggleModal}>Configuración del juego</button>

        {modalOpen && <ConfigModal toggleModal={toggleModal} />}

        <section className='turn'>
          <Square isSelected={turn === TURNS.X}>
            {TURNS.X}
          </Square>
          <Square isSelected={turn === TURNS.O}>
            {TURNS.O}
          </Square>
        </section>

        <section className='chooseIcons' >
          <p>Elegir iconos</p>
          {ICONS}

          <button onClick={iconsHandleClick}>
            Iconos: {icons}
          </button>
        </section>
      </section>

      <WinnerModal resetGame={resetGame} winner={winner} />
    </main>
  )
}

export default App
