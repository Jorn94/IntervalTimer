let timers = [
    { name: 'Run', interval: 30 * 1000 }, // 30 seconds for "Run"
    { name: 'Walk', interval: 60 * 1000 } // 60 seconds for "Walk"
];
let currentTimerIndex = 0;
let currentLoopCount = 0;
let maxLoops = 3;
let timer;
let isRunning = false;
let timeRemaining;

const loopCountInput = document.getElementById('loopCount');
const addTimerButton = document.getElementById('addTimerButton');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const resetButton = document.getElementById('resetButton');
const currentTimerDisplay = document.getElementById('currentTimerDisplay');
const timeDisplay = document.getElementById('timeDisplay');

// Sounds
const runSound = new Audio('run-whistle.mp3');
const walkSound = new Audio('walk-bell.mp3');

// Add timer button logic
addTimerButton.addEventListener('click', () => {
    const timerRow = document.createElement('div');
    timerRow.classList.add('timer-row');
    timerRow.innerHTML = `
        <input type="text" class="timer-name" placeholder="Timer Name" />
        <input type="number" class="timer-interval" placeholder="Interval (sec)" />
    `;
    document.getElementById('timerList').appendChild(timerRow);
});

// Start button logic
startButton.addEventListener('click', () => {
    timers = [];
    document.querySelectorAll('.timer-row').forEach(row => {
        const timerName = row.querySelector('.timer-name').value || 'Unnamed Timer';
        const interval = row.querySelector('.timer-interval').value;
        if (interval) {
            timers.push({
                name: timerName,
                interval: parseInt(interval) * 1000
            });
        }
    });

    maxLoops = parseInt(loopCountInput.value) || 1;
    currentLoopCount = 0;
    currentTimerIndex = 0;

    if (!isRunning && timers.length > 0) {
        isRunning = true;
        stopButton.disabled = false;
        resetButton.disabled = false;
        startSequence();
    }
});

// Stop button logic
stopButton.addEventListener('click', () => {
    stopTimer();
    isRunning = false;
    stopButton.disabled = true;
});

// Reset button logic
resetButton.addEventListener('click', () => {
    stopTimer();
    isRunning = false;
    currentTimerDisplay.textContent = '';
    timeDisplay.textContent = '';
    stopButton.disabled = true;
    resetButton.disabled = true;
});

// Timer sequence logic
function startSequence() {
    if (currentLoopCount < maxLoops) {
        if (currentTimerIndex < timers.length) {
            startTimer(timers[currentTimerIndex]);
        } else {
            currentTimerIndex = 0;
            currentLoopCount++;
            startSequence();
        }
    } else {
        alert('Sequence Complete!');
        stopTimer();
        isRunning = false;
        stopButton.disabled = true;
    }
}

// Timer logic
function startTimer(timerObject) {
    currentTimerDisplay.textContent = `Current Timer: ${timerObject.name}`;
    timeRemaining = timerObject.interval;

    timer = setInterval(() => {
        timeRemaining -= 1000;
        updateDisplay();

        if (timeRemaining <= 0) {
            clearInterval(timer);

            // Play specific sounds based on timer name
            if (timerObject.name === 'Run') {
                runSound.play();
            } else if (timerObject.name === 'Walk') {
                walkSound.play();
            }

            currentTimerIndex++;
            startSequence();
        }
    }, 1000);
}

// Stop timer logic
function stopTimer() {
    clearInterval(timer);
}

// Display time remaining
function updateDisplay() {
    timeDisplay.textContent = `Time remaining: ${timeRemaining / 1000} seconds`;
}
