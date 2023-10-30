    const PlayerFactory = (name, mark, ai, turn, font) => {
        
        return{name, mark, ai, turn, font};
    };

    const fonts = [
        'Leimzy',
        'Barlow',
        'Barlowfold',
        'Grotesk',
        'GAILA',
        'Pizus',
        'Betatron',
        'Centaury',
        'Conf',
        'Crystal',
        'DTG',
        'Escarbeau',
        'Gensco',
        'GTL',
        'Hellplague',
        'Jessen',
        'Kulope',
        'lcmogi',
        'Leimzy',
        'Linea',
        'Lobular',
        'Maizus',
        'Phosphene',
        'Reg',
        'Revival',
        'Saint',
        'Guilt',
        'Singler',
        'Squared',
        'Superdot',
        'Typefesse',
        'Zaltys']

    const setFont = () =>{
        return fonts[Math.floor(Math.random() * (fonts.length))]
    }

    const setSize = (min, max) =>{
        return Math.random() * (max - min) + min;
    }

    function setColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }

    let interfaceFont = setFont()

    let player1 = PlayerFactory('Player 1', 'X', false, true, setFont())
    let player2 = PlayerFactory('Player 2', 'O', false, false, setFont())

    let winner = null;
    let activePlayer = player1
    let pasivePlayer = player2
    let board = new Array(8).fill('');

    const cell0 = document.getElementById('cell0')
    const cell1 = document.getElementById('cell1')
    const cell2 = document.getElementById('cell2')
    const cell3 = document.getElementById('cell3')
    const cell4 = document.getElementById('cell4')
    const cell5 = document.getElementById('cell5')
    const cell6 = document.getElementById('cell6')
    const cell7 = document.getElementById('cell7')
    const cell8 = document.getElementById('cell8')
    const body = document.getElementById('body')
    const menu = document.getElementById('menu')
    const twoPlayerBtn = document.getElementById('twoPlayer')
    const aiBtn = document.getElementById('ai')
    const Tic = document.getElementById('Tic')
    const Tac = document.getElementById('Tac')
    const Toe = document.getElementById('Toe')
    const names = document.getElementById('names')
    const allElements = document.querySelectorAll('*');
    const root = document.documentElement

    root.style.setProperty ('--background-color', setColor())
    root.style.setProperty ('--text', setColor())

    for (var i = 0; i < allElements.length; i++) {
        allElements[i].style.fontFamily = interfaceFont;
    }

    Tic.style.fontFamily = (setFont())
    Tic.style.fontSize = (setSize(2,4) + "em")
    Tac.style.fontFamily = (setFont())
    Tac.style.fontSize = (setSize(2,4) + "em")
    Toe.style.fontFamily = (setFont())
    Toe.style.fontSize = (setSize(2,4) + "em")


    setPlayer = (player) => {
        return new Promise((resolve, reject) => {
            
            const background = document.createElement('div')
            const greetings = document.createElement('h1')
            const instructions = document.createElement('h2')
            const input = document.createElement('input')
    
            background.classList.add('introBackground')
            greetings.classList.add('greetings')
            instructions.classList.add('instructions')
            input.classList.add('inputName')
            input.setAttribute('type', 'text')
            input.setAttribute('maxlength', 18)
            input.setAttribute('autofocus', 'autofocus')

            greetings.style.fontFamily = player.font
            instructions.style.fontFamily = player.font
            input.style.fontFamily = player.font
    
            greetings.textContent = ("Wellcome " + player.name)
            instructions.textContent = 'introduce your name'
    
            input.onkeydown = (event)  =>{
                if (event.key == "Enter" && input.value != ''){
                    player.name = input.value
                    greetings.textContent = player.name
                    instructions.textContent = 'enter your symbol'
                    input.value = ''
                    input.setAttribute('maxlength', 1)
                    input.onkeydown = (event) =>{
                        if (event.key == "Enter" && input.value != ''){
                            let symbol = input.value
                            player.mark = symbol[0]
                            background.remove()
                            greetings.remove()
                            instructions.remove()
                            input.remove()
                            resolve()
                        }
                    }
                }
            }
    
            background.appendChild(greetings)
            background.appendChild(instructions)
            background.appendChild(input)
            body.appendChild(background)
            input.focus()
        })
    }

    async function twoPlayer () {
        menu.style.display = "none"
        player2.ai = false
        await setPlayer(player1)
        await setPlayer(player2)
        names.textContent = player1.name + " V.S " + player2.name
    }

    async function ai () {
        menu.style.display = "none"
        await setPlayer(player1)
        player2.name = 'Jeff'
        player2.mark = 'J'
        player2.ai = true
        names.textContent = player1.name + " V.S " + player2.name
    }

    const reset = () =>{
        cells.forEach((cell) =>{
            cell.textContent= ''
        })
        board.forEach ((_, index, arr) => {
            arr[index] = '';
        })
        winner = null
        activePlayer = player1
        pasivePlayer = player2
    }
    
    const resset = () => {
        root.style.setProperty ('--background-color', setColor())
        root.style.setProperty ('--text', setColor())

        interfaceFont = setFont()
        for (var i = 0; i < allElements.length; i++) {
            allElements[i].style.fontFamily = interfaceFont;
        }

        menu.style.display = "flex"

        player1 = PlayerFactory('Player 1', 'X', false, true, setFont())
        player2 = PlayerFactory('Player 2', 'O', false, false, setFont())

        Tic.style.fontFamily = (setFont())
        Tic.style.fontSize = (setSize(2,4) + "em")
        Tac.style.fontFamily = (setFont())
        Tac.style.fontSize = (setSize(2,4) + "em")
        Toe.style.fontFamily = (setFont())
        Toe.style.fontSize = (setSize(2,4) + "em")

        reset ()
    }
    
    const turn = (cell) =>{
        if (winner == null && cell.textContent == '') {
            board [parseInt(cell.id)] = activePlayer.mark
            cell.style.fontFamily = activePlayer.font
            cell.textContent = activePlayer.mark
            if (winCheck()){
                winner = activePlayer
                winScreen()
            }

            if (pasivePlayer.ai && winner == null){
                aiPlay();
                if (winCheck()){
                    winner = player2
                    winScreen()
                }
            } else{
                [activePlayer, pasivePlayer] = [pasivePlayer, activePlayer];
            }
        }  
        console.log('pesicola')
        console.log(board)    
    };

    const winCheck = () =>{

        for (let i = 0; i <3; i++) {
            let row = []
            for (let j = 0; j < 3; j++) {
                row.push(board[j+(i*3)])
            }
            if (ArraySame(row) && row[0]!= ''){
                console.log('winnoli')
                return true;
            }
        }

        for (let i = 0; i < 3; i++) {
            let col = []
            for (let j = 0; j < 3; j++) {
                col.push(board[(j*3)+i])
            }
            if (ArraySame(col) && col[0]!= ''){
                console.log('winnoli')
                return true;
            }
        }

        let diagonal1 = [board[0], board[4], board[8]]
        let diagonal2 = [board[2], board[4], board[6]]

        if ((ArraySame (diagonal1) && diagonal1[0]!= '') || (ArraySame(diagonal2)&& diagonal2[0]!= '')){
            console.log('winnoli')
            return true;
        }
    };

    function ArraySame(arr) {
        if (arr.length === 0) {
          return true;
        }
        const firstElement = arr[0];
        if (firstElement == undefined){
            return false
        }
        for (let i = 1; i < arr.length; i++) {
          if (arr[i] !== firstElement) {
            return false;
          }
        }
        return true;
      }
      

    const winScreen = () =>{
        const blur = document.createElement('div')
        const text = document.createElement('h2')
        const textWinner = document.createElement('h1')

        blur.classList.add('blur')
        text.classList.add('winText')
        textWinner.classList.add('txtWinner')

        text.textContent = 'The winner is'
        textWinner.textContent = winner.name

        blur.onclick = () =>{
            reset()
            blur.remove()
            text.remove()
            textWinner.remove()
        }

        blur.appendChild(text)
        blur.appendChild(textWinner)
        body.appendChild(blur)
    }
    
    const aiPlay = (() =>{
        let emptyCells = []
        for (let i = 0; i < board.length; i++) {
            if (board[i] == '') {
              emptyCells.push(i);
            }
        }

        if (emptyCells.length != 0){
            let randomPlay = Math.floor(Math.random() * (emptyCells.length))
            board[emptyCells[randomPlay]] = player2.mark
            let aiCell = document.getElementById(emptyCells[randomPlay])
            aiCell.style.fontFamily = player2.font
            aiCell.textContent = player2.mark
        }

        console.log(emptyCells)
    });

    const cells = document.querySelectorAll('.cell')
    console.log(cells)
    cells.forEach(cell =>{
        console.log(cell)
        cell.addEventListener('click', () => {
            turn(cell)    
        })
    })


    
    
