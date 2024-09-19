let timers = [];
let currentTimerIndex = 0;
let currentLoopCount = 0;
let maxLoops = 1;
let timer;
let isRunning = false;
let timeRemaining;

const timerList = document.getElementById('timerList');
const loopCountInput = document.getElementById('loopCount');
const addTimerButton = document.getElementById('addTimerButton');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const resetButton = document.getElementById('resetButton');
const currentTimerDisplay = document.getElementById('currentTimerDisplay');
const timeDisplay = document.getElementById('timeDisplay');

addTimerButton.addEventListener('click', () => {
    const timerRow = document.createElement('div');
    timerRow.classList.add('timer-row');
    timerRow.innerHTML = `
        <input type="text" class="timer-name" placeholder="Timer Name" />
        <input type="number" class="timer-interval" placeholder="Interval (sec)" />
    `;
    timerList.appendChild(timerRow);
});

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
    
    if (timers.length === 0) {
        alert('Please add at least one timer with a valid interval.');
        return;
    }

    maxLoops = parseInt(loopCountInput.value) || 1;
    currentLoopCount = 0;
    currentTimerIndex = 0;

    if (!isRunning) {
        isRunning = true;
        stopButton.disabled = false;
        resetButton.disabled = false;
        startSequence();
    }
});

stopButton.addEventListener('click', () => {
    stopTimer();
    isRunning = false;
    stopButton.disabled = true;
});

resetButton.addEventListener('click', () => {
    stopTimer();
    isRunning = false;
    currentTimerDisplay.textContent = '';
    timeDisplay.textContent = '';
    stopButton.disabled = true;
    resetButton.disabled = true;
});

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

function startTimer(timerObject) {
    currentTimerDisplay.textContent = `Current Timer: ${timerObject.name}`;
    timeRemaining = timerObject.interval;

    timer = setInterval(() => {
        timeRemaining -= 1000;
        updateDisplay();

        if (timeRemaining <= 0) {
            clearInterval(timer);
            currentTimerIndex++;
            startSequence();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function updateDisplay() {
    timeDisplay.textContent = `Time remaining: ${timeRemaining / 1000} seconds`;
}
