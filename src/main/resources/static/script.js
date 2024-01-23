let mediaRecorder;
let audioBlob;

const recordButton = document.getElementById('recordButton');
const sendButton = document.getElementById('sendButton');
const transcription = document.getElementById('transcription');

recordButton.addEventListener('click', async () => {
    if (recordButton.textContent === 'Gravar Áudio') {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();

            const audioChunks = [];
            mediaRecorder.addEventListener('dataavailable', event => {
                audioChunks.push(event.data);
            });

            mediaRecorder.addEventListener('stop', () => {
                audioBlob = new Blob(audioChunks);
                sendButton.disabled = false;
            });

            recordButton.textContent = 'Parar Gravação';
        } catch (error) {
            console.error('Erro ao acessar o dispositivo de mídia: ', error);
        }
    } else {
        mediaRecorder.stop();
        recordButton.textContent = 'Gravar Áudio';
    }
});

sendButton.addEventListener('click', async () => {
    try {
        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.webm');

        const response = await fetch(`http://localhost:8080/transcribed-audios`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Ocorreu um erro desconhecido.');
        }

        const data = await response.json();
        transcription.textContent = data.transcript;
    } catch (error) {
        console.error('Houve um problema com a operação de fetch: ', error);
    }
});
