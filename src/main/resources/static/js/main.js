// region TEXT CONSTANTS

const RECORD_BUTTON_TEXT = {
    START: 'Iniciar Gravação',
    STOP: 'Parar Gravação',
};
const TRANSCRIBE_BUTTON_TEXT = {
    DEFAULT: 'Transcrever Áudio',
    TRANSCRIBING: 'Transcrevendo...',
};
const TRANSCRIPTION_API_URL = 'http://localhost:8080/transcribed-audios';

// endregion

// region DOM ELEMENTS

const startStopRecordButton = document.getElementById('startStopButton');
const audioPlayer = document.getElementById('audioPlayer');
const transcribeButton = document.getElementById('transcribeButton');
const transcriptText = document.getElementById('transcriptText');

// endregion

function main() {
    const audioRecorder = new AudioRecorder();
    startStopRecordButton.onclick = () => handleRecordButton(audioRecorder);
    transcribeButton.onclick = () => handleTranscribeButton(audioRecorder);
}

async function handleRecordButton(audioRecorder) {
    if (startStopRecordButton.innerText === RECORD_BUTTON_TEXT.START) {
        await startRecording(audioRecorder);
    } else {
        await stopRecording(audioRecorder);
    }
}

async function startRecording(audioRecorder) {
    // TODO: 2.1. Utilizar a instância de AudioRecorder para iniciar a gravação do áudio.
    startStopRecordButton.innerText = RECORD_BUTTON_TEXT.STOP;
    transcribeButton.disabled = true;
}

async function stopRecording(audioRecorder) {
    // TODO: 2.2. Utilizar a instância de AudioRecorder para parar a gravação do áudio.
    startStopRecordButton.innerText = RECORD_BUTTON_TEXT.START;
    transcribeButton.disabled = false;
}

async function handleTranscribeButton(audioRecorder) {
    // TODO: 2.3. Utilizar a instância de AudioRecorder para recuperar a áudio gravado.
    transcribeButton.disabled = true;
    transcribeButton.innerText = TRANSCRIBE_BUTTON_TEXT.TRANSCRIBING;

    // TODO: 2.4. Integrar com nossa API REST de trancrição de áudio. Remover esse setTimeout maroto ;)
    setTimeout(function () {
        transcribeButton.disabled = false;
        transcribeButton.innerText = TRANSCRIBE_BUTTON_TEXT.DEFAULT;
    }, 1000);
}

document.addEventListener('DOMContentLoaded', main);
