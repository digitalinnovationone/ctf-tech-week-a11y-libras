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

async function main() {
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
    await audioRecorder.start();
    startStopRecordButton.innerText = RECORD_BUTTON_TEXT.STOP;
    transcribeButton.disabled = true;
}

async function stopRecording(audioRecorder) {
    const audioBlob = await audioRecorder.stop();
    const oldAudioUrl = audioPlayer.src;

    // Criar nova URL para o novo Blob
    audioPlayer.src = URL.createObjectURL(audioBlob);

    // Liberar a URL antiga, se existir
    if (oldAudioUrl) {
        URL.revokeObjectURL(oldAudioUrl);
    }

    // Atualizar a UI
    startStopRecordButton.innerText = RECORD_BUTTON_TEXT.START;
    transcribeButton.disabled = false;
}

async function handleTranscribeButton(audioRecorder) {
    const audioBlob = await audioRecorder.currentRecord;
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');

    transcribeButton.disabled = true;
    transcribeButton.innerText = TRANSCRIBE_BUTTON_TEXT.TRANSCRIBING;

    try {
        const response = await fetch(TRANSCRIPTION_API_URL, {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        transcriptText.innerText = response.ok ? data.transcript : `[API ERROR] ${data.message}`;
    } catch (error) {
        console.error('Erro inesperado ao transcrever o áudio:', error);
    } finally {
        transcribeButton.disabled = false;
        transcribeButton.innerText = TRANSCRIBE_BUTTON_TEXT.DEFAULT;
    }
}

document.addEventListener('DOMContentLoaded', main);
