
async function main() {
    const startStopRecordButton = document.getElementById('startStopButton');
    const audioPlayer = document.getElementById('audioPlayer');
    const transcribeButton = document.getElementById('transcribeButton');
    const transcriptText = document.getElementById('transcriptText');
    
    const audioRecorder = new AudioRecorder();

    startStopRecordButton.addEventListener('click', async () => {
        if (startStopRecordButton.innerText === 'Iniciar Gravação') {
            audioRecorder.start();
            startStopRecordButton.innerText = 'Parar Gravação';
            transcribeButton.disabled = true;
        } else {
            const audioBlob = await audioRecorder.stop();
            const audioUrl = URL.createObjectURL(audioBlob);
            audioPlayer.src = audioUrl;
            startStopRecordButton.innerText = 'Iniciar Gravação';
            transcribeButton.disabled = false;
        }
    });

    transcribeButton.addEventListener('click', async () => {
        const audioBlob = await audioRecorder.getCurrentRecord();
        
        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.webm');
        
        const response = await fetch('http://localhost:8080/transcribed-audios', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        transcriptText.innerText = data.transcript;
    })
}

document.addEventListener('DOMContentLoaded', main)
