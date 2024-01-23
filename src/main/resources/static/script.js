let mediaRecorder;
let audioBlob;

const recordButton = document.getElementById('recordButton');
const sendButton = document.getElementById('sendButton');
const transcription = document.getElementById('transcription');

recordButton.addEventListener('click', () => {
    if (recordButton.textContent === 'Gravar Áudio') {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
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
            });
    } else {
        mediaRecorder.stop();
        recordButton.textContent = 'Gravar Áudio';
    }
});

sendButton.addEventListener('click', () => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');

    fetch(`http://localhost:8080/transcribed-audios`, {
        method: 'POST',
        body: formData,
    }).then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(text || 'Ocorreu um erro desconhecido.');
            })
        }
        return response.json();
    })
    .then(data => {
        transcription.textContent = data.transcript
    })
    .catch(error => {
        console.error('Houve um problema com a operação de fetch: ', error);
    })
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}
