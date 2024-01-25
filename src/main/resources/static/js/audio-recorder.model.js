/**
 * Classe para gerenciar a gravação de áudio.
 *
 * @overview https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
 */
class AudioRecorder {
    #mediaRecorder = null;
    #audioPromise = null;
    static AUDIO_TYPE = 'audio/wav';

    async start() {
        const stream = await navigator.mediaDevices.getUserMedia({audio: true});
        this.#setupMediaRecorder(stream);
        this.#mediaRecorder.start();
    }

    #setupMediaRecorder(stream) {
        const audioChunks = [];
        this.#mediaRecorder = new MediaRecorder(stream);
        this.#mediaRecorder.ondataavailable = event => audioChunks.push(event.data)
        this.#audioPromise = new Promise((resolve) => {
            this.#mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: AudioRecorder.AUDIO_TYPE });
                resolve(audioBlob);
            };
        });
    }

    stop() {
        this.#mediaRecorder.stop();
        return this.#audioPromise;
    }

    get recordedAudio() {
        return this.#audioPromise;
    }
}
