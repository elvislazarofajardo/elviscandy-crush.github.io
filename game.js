document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const width = 8;
    const candies = [];
    const candyColors = [
        'candy-1', 'candy-2', 'candy-3', 
        'candy-4', 'candy-5', 'candy-6'
    ];
    
    let selectedCandy = null;
    let selectedCandyId = null;
    let score = 0;
    let time = 60;
    let timer;
    const scoreDisplay = document.getElementById('score');
    const timeDisplay = document.getElementById('time');
    const startButton = document.getElementById('start-btn');

    startButton.addEventListener('click', startGame);

    // Crear la cuadrícula
    function createBoard() {
        grid.innerHTML = '';  // Limpiar el tablero para cada reinicio
        candies.length = 0;
        for (let i = 0; i < width * width; i++) {
            const candy = document.createElement('div');
            const randomColor = Math.floor(Math.random() * candyColors.length);
            candy.classList.add('candy', candyColors[randomColor]);
            candy.setAttribute('data-id', i);
            candy.setAttribute('draggable', 'false');
            candy.addEventListener('touchstart', selectCandy);
            candy.addEventListener('touchend', dropCandy);
            grid.appendChild(candy);
            candies.push(candy);
        }
    }

    // Seleccionar caramelos
    function selectCandy(event) {
        selectedCandy = event.target;
        selectedCandyId = parseInt(selectedCandy.getAttribute('data-id'));
    }

    // Soltar caramelos
    function dropCandy(event) {
        const targetCandy = event.target;
        const targetCandyId = parseInt(targetCandy.getAttribute('data-id'));
        const validMoves = [
            selectedCandyId - 1, selectedCandyId + 1, 
            selectedCandyId - width, selectedCandyId + width
        ];

        if (validMoves.includes(targetCandyId)) {
            swapCandies(selectedCandy, targetCandy);
            checkForMatches();
        }
    }

    // Intercambiar caramelos
    function swapCandies(candyOne, candyTwo) {
        const classOne = candyOne.className;
        const classTwo = candyTwo.className;
        
        candyOne.className = classTwo;
        candyTwo.className = classOne;
    }

    // Detectar coincidencias (básico para filas de 3)
    function checkForMatches() {
        let matchesFound = false;

        // Filas
        for (let i = 0; i < 64; i++) {
            const rowOfThree = [i, i + 1, i + 2];
            const decidedColor = candies[i].className;
            const isBlank = decidedColor === '';

            if (rowOfThree.every(index => candies[index].className === decidedColor && !isBlank)) {
                rowOfThree.forEach(index => {
                    candies[index].className = '';
                });
                matchesFound = true;
                updateScore(10);  // Aumenta los puntos al encontrar una combinación
            }
        }

        // Columnas
        for (let i = 0; i < 48; i++) {
            const columnOfThree = [i, i + width, i + width * 2];
            const decidedColor = candies[i].className;
            const isBlank = decidedColor === '';

            if (columnOfThree.every(index => candies[index].className === decidedColor && !isBlank)) {
                columnOfThree.forEach(index => {
                    candies[index].className = '';
                });
                matchesFound = true;
                updateScore(10);  // Aumenta los puntos al encontrar una combinación
            }
        }

        if (matchesFound) {
            setTimeout(refillBoard, 100);  // Rellena después de eliminar coincidencias
        }
    }

    // Rellenar tablero después de eliminar coincidencias
    function refillBoard() {
        for (let i = 0; i < 64; i++) {
            if (candies[i].className === '') {
                const randomColor = Math.floor(Math.random() * candyColors.length);
                candies[i].classList.add(candyColors[randomColor]);
            }
        }
    }

    // Actualizar puntos
    function updateScore(points) {
        score += points;
        scoreDisplay.textContent = score;
    }

    // Control del tiempo
    function updateTime() {
        time--;
        timeDisplay.textContent = time;
        if (time <= 0) {
            clearInterval(timer);
            alert(`¡Tiempo terminado! Tu puntuación final es: ${score}`);
        }
    }

    // Iniciar juego
    function startGame() {
        score = 0;
        time = 60;
        scoreDisplay.textContent = score;
        timeDisplay.textContent = time;
        clearInterval(timer);
        createBoard();
        timer = setInterval(updateTime, 1000);  // Reduce el tiempo cada segundo
    }

    createBoard();
});
