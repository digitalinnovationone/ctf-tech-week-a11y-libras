
class AudioRecorder {
    _mediaRecorder = null;
    _audioPromise = null;

    requestMediaRecorderPermission() {
        return navigator.mediaDevices.getUserMedia({ audio: true })
    }
    
    async start() {
        const stream = await this.requestMediaRecorderPermission();

        this._mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        this._mediaRecorder.ondataavailable = (event) => audioChunks.push(event.data);

        this._audioPromise = new Promise((resolve, reject) => {
            this._mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                resolve(audioBlob);
            };
        });

        this._mediaRecorder.start();
    }

    stop() {
        if (!this._mediaRecorder || !this._audioPromise) throw new Error('Gravação não iniciada!')
        this._mediaRecorder.stop();
        return this._audioPromise;
    }

    getCurrentRecord() {
        if (!this._audioPromise) throw new Error('Gravação não iniciada!')
        return this._audioPromise;
    }
}
