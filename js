// script.js
document.addEventListener('DOMContentLoaded', function() {
    const wheels = document.querySelectorAll('.wheel');
    const player1SpinButton = document.getElementById('player1Spin');
    const player2SpinButton = document.getElementById('player2Spin');
    const result = document.getElementById('result');
    const player1ScoreElem = document.getElementById('player1Score');
    const player2ScoreElem = document.getElementById('player2Score');
    const player1NameInput = document.getElementById('player1Name');
    const player2NameInput = document.getElementById('player2Name');
    const player1BetInput = document.getElementById('player1Bet');
    const player2BetInput = document.getElementById('player2Bet');
    const player1WithdrawButton = document.getElementById('player1Withdraw');
    const player2WithdrawButton = document.getElementById('player2Withdraw');
    let player1Score = 20;
    let player2Score = 20;
    let player1SpinResult = null;
    let player2SpinResult = null;
    let round = 0;
    const maxRounds = 2;

    // Initialize scores from localStorage if available
    player1Score = parseInt(localStorage.getItem('player1Score') || '20', 10);
    player2Score = parseInt(localStorage.getItem('player2Score') || '20', 10);
    updateScores();

    // Colors for numbers
    const colors = [
        'green', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red',
        'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red',
        'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red',
        'black', 'red', 'black', 'red', 'black', 'red'
    ];

    // Create numbers dynamically for both wheels
    wheels.forEach(wheel => {
        for (let i = 0; i < 37; i++) {
            const number = document.createElement('div');
            number.className = `number ${colors[i]}`;
            number.style.transform = `rotate(${(i / 37) * 360}deg) translateX(130px)`;
            number.textContent = i;
            wheel.appendChild(number);
        }
    });

    player1SpinButton.addEventListener('click', function() {
        if (player1SpinResult !== null) {
            result.textContent = 'Player 1 has already spun.';
            return;
        }

        const player1Name = player1NameInput.value.trim();
        const player1Bet = parseInt(player1BetInput.value, 10);

        if (!player1Name) {
            result.textContent = 'Player 1 must enter their name.';
            return;
        }

        if (isNaN(player1Bet) || player1Bet < 5) {
            result.textContent = 'Player 1 must place a valid bet of at least 5 points.';
            return;
        }

        if (player1Score < player1Bet) {
            result.textContent = 'Player 1 does not have enough points to place this bet.';
            return;
        }

        spinRoulette(0, player1Bet);
    });

    player2SpinButton.addEventListener('click', function() {
        if (player2SpinResult !== null) {
            result.textContent = 'Player 2 has already spun.';
            return;
        }

        const player2Name = player2NameInput.value.trim();
        const player2Bet = parseInt(player2BetInput.value, 10);

        if (!player2Name) {
            result.textContent = 'Player 2 must enter their name.';
            return;
        }

        if (isNaN(player2Bet) || player2Bet < 5) {
            result.textContent = 'Player 2 must place a valid bet of at least 5 points.';
            return;
        }

        if (player2Score < player2Bet) {
            result.textContent = 'Player 2 does not have enough points to place this bet.';
            return;
        }

        spinRoulette(1, player2Bet);
    });

    function spinRoulette(playerIndex, bet) {
        const wheel = wheels[playerIndex];
        const randomNumber = Math.floor(Math.random() * 37);
        const degreesPerNumber = 360 / 37;
        const totalSpins = 10; // Number of full spins for visual effect
        const degrees = (randomNumber * degreesPerNumber) + (totalSpins * 360); // Calculate total degrees

        wheel.style.transition = 'transform 4s ease-out';
        wheel.style.transform = `rotate(${degrees}deg)`;

        setTimeout(() => {
            wheel.style.transition = 'none';
            const finalRotation = (randomNumber * degreesPerNumber) % 360;
            wheel.style.transform = `rotate(${finalRotation}deg)`;

            if (playerIndex === 0) {
                player1SpinResult = randomNumber;
                player1Score -= bet;
                if (player2SpinResult !== null) {
                    determineWinner(player1SpinResult, player2SpinResult);
                }
            } else {
                player2SpinResult = randomNumber;
                player2Score -= bet;
                if (player1SpinResult !== null) {
                    determineWinner(player1SpinResult, player2SpinResult);
                }
            }

            updateScores();
        }, 4000); // Match the transition time
    }

    function determineWinner(player1Result, player2Result) {
        let message = '';
        round++;

        if (player1Result > player2Result) {
            player1Score += 10; // 5 points deducted earlier + 5 points for winning
            message += `${player1NameInput.value.trim()} wins this round with ${player1Result} against ${player2Result}. `;
        } else if (player1Result < player2Result) {
            player2Score += 10; // 5 points deducted earlier + 5 points for winning
            message += `${player2NameInput.value.trim()} wins this round with ${player2Result} against ${player1Result}. `;
        } else {
            message += `It's a tie with both getting ${player1Result}. `;
        }

        if (round >= maxRounds) {
            message += `Game over! `;
            player1SpinButton.disabled = true;
            player2SpinButton.disabled = true;
        }

        player1SpinResult = null;
        player2SpinResult = null;
        result.textContent = message.trim();
    }

    function updateScores() {
        player1ScoreElem.textContent = player1Score;
        player2ScoreElem.textContent = player2Score;

        localStorage.setItem('player1Score', player1Score);
        localStorage.setItem('player2Score', player2Score);
    }

    player1WithdrawButton.addEventListener('click', function() {
        alert(`${player1NameInput.value.trim()} withdraws with ${player1Score} points.`);
        player1Score = 0;
        updateScores();
    });

    player2WithdrawButton.addEventListener('click', function() {
        alert(`${player2NameInput.value.trim()} withdraws with ${player2Score} points.`);
        player2Score = 0;
        updateScores();
    });
});

