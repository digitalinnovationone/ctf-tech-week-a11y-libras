/**
 * Classe para gerenciar a gravação de áudio.
 *
 * @overview https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
 */
class AudioRecorder {
    #mediaRecorder = null;
    #audioPromise = null;
    static AUDIO_TYPE = 'audio/wav';

    /**
     * Inicia a gravação de áudio.
     */
    async start() {
        const stream = await this.#requestMediaRecorderPermission();
        this.#setupMediaRecorder(stream);
        this.#mediaRecorder.start();
    }

    /**
     * Solicita permissão para usar o microfone e retorna o stream de mídia.
     */
    async #requestMediaRecorderPermission() {
        try {
            return await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (error) {
            throw new Error('Permissão de microfone negada.');
        }
    }

    /**
     * Configura o MediaRecorder com o stream fornecido.
     */
    #setupMediaRecorder(stream) {
        this.#mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        this.#mediaRecorder.ondataavailable = event => audioChunks.push(event.data);

        this.#audioPromise = new Promise((resolve) => {
            this.#mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: AudioRecorder.AUDIO_TYPE });
                stream.getTracks().forEach(track => track.stop()); // Liberando recursos
                resolve(audioBlob);
            };
        });
    }

    /**
     * Para a gravação.
     */
    stop() {
        if (!this.#mediaRecorder || !this.#audioPromise) {
            throw new Error('Gravação não iniciada!');
        }
        try {
            this.#mediaRecorder.stop();
        } catch (error) {
            console.error('Erro ao parar a gravação:', error);
        }
        return this.#audioPromise;
    }

    /**
     * Retorna a Promise com o blob de áudio da gravação atual.
     */
    get currentRecord() {
        if (!this.#audioPromise) {
            throw new Error('Gravação não iniciada!');
        }
        return this.#audioPromise;
    }
}
