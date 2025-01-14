// Fetch and load sequences from a JSON file
function loadSequences() {
    return fetch('sequences.json')
        .then(response => response.json())
        .catch(error => {
            console.error('Failed to load sequences:', error);
            return [];
        });
}

// Timer logic
function startTimer(duration, display, onFinish) {
    let timer = duration, minutes, seconds;
    const interval = setInterval(() => {
        minutes = Math.floor(timer / 60);
        seconds = timer % 60;

        // Format time
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        // Update the display
        display.textContent = `${minutes}:${seconds}`;

        if (--timer < 0) {
            clearInterval(interval);
            onFinish();
        }
    }, 1000);
}

// Handle sequence selection and start
document.addEventListener('DOMContentLoaded', async () => {
    const sequenceSelector = document.querySelector('#sequenceSelector');
    const startButton = document.querySelector('#startSequenceButton');
    const timeDisplay = document.querySelector('#time');
    const exerciseNameDisplay = document.querySelector('#exerciseName');

    const sequences = await loadSequences();

    // Populate sequence dropdown
    sequences.forEach((sequence, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = sequence.name;
        sequenceSelector.appendChild(option);
    });

    // Start the selected sequence
    startButton.addEventListener('click', () => {
        const selectedIndex = sequenceSelector.value;
        if (selectedIndex === "") {
            alert('Please select a sequence!');
            return;
        }

        const sequence = sequences[selectedIndex];
        let currentExerciseIndex = 0;

        const startNextExercise = () => {
            if (currentExerciseIndex < sequence.exercises.length) {
                const exercise = sequence.exercises[currentExerciseIndex];
                exerciseNameDisplay.textContent = exercise.name;
                startTimer(exercise.duration, timeDisplay, () => {
                    currentExerciseIndex++;
                    startNextExercise();
                });
            } else {
                exerciseNameDisplay.textContent = 'Sequence Complete!';
                timeDisplay.textContent = '00:00';
            }
        };

        startNextExercise();
    });
});
