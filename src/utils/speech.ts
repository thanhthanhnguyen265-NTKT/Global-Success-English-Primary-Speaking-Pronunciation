/**
 * Audio and speech utilities for child-friendly pronunciation practice.
 */

// Play sound using Web Speech API with rich natural voice selection and pitch tuning
export async function playTextToSpeech(
  text: string,
  options?: { slow?: boolean }
): Promise<void> {
  const isSlow = options?.slow ?? false;
  return speakWithBrowser(text, isSlow);
}

function speakWithBrowser(text: string, isSlow: boolean): Promise<void> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve();
      return;
    }

    try {
      window.speechSynthesis.cancel();

      // Clean text of any accidental labels or prompts
      const cleaned = text
        .replace(/^(Teacher Lily:?|AI:?|Lily:?)/i, '')
        .replace(/Speak (slowly|clearly|warmly)[^:]*:\s*/gi, '')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.lang = 'en-US';
      utterance.rate = isSlow ? 0.75 : 0.95;
      utterance.pitch = 1.05; // warm, friendly teacher tone for young learners

      const applyBestVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice =
          voices.find(
            (v) =>
              v.lang.startsWith('en') &&
              (v.name.includes('Natural') ||
                v.name.includes('Google US English') ||
                v.name.includes('Samantha') ||
                v.name.includes('Jenny') ||
                v.name.includes('Karen') ||
                v.name.includes('Zira') ||
                v.name.includes('Victoria'))
          ) ||
          voices.find((v) => v.lang.startsWith('en-US')) ||
          voices.find((v) => v.lang.startsWith('en'));

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      };

      applyBestVoice();
      if (!utterance.voice && window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = applyBestVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis notice:', e);
      resolve();
    }
  });
}

// Media Recorder Manager for Pupil Audio
export class PupilAudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private recognition: any = null;
  private recognizedTranscript = '';
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private animFrameId: number | null = null;

  public isRecording = false;

  async startRecording(
    onVolumeChange?: (volume: number) => void
  ): Promise<boolean> {
    try {
      this.audioChunks = [];
      this.recognizedTranscript = '';

      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Live volume visualization
      if (onVolumeChange) {
        try {
          const AudioContextClass =
            window.AudioContext || (window as any).webkitAudioContext;
          this.audioContext = new AudioContextClass();
          const source = this.audioContext.createMediaStreamSource(this.stream);
          this.analyser = this.audioContext.createAnalyser();
          this.analyser.fftSize = 256;
          source.connect(this.analyser);

          const bufferLength = this.analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          const checkVolume = () => {
            if (!this.isRecording || !this.analyser) return;
            this.analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
              sum += dataArray[i];
            }
            const average = sum / bufferLength;
            const normalized = Math.min(100, Math.round((average / 128) * 100));
            onVolumeChange(normalized);
            this.animFrameId = requestAnimationFrame(checkVolume);
          };
          this.animFrameId = requestAnimationFrame(checkVolume);
        } catch (err) {
          console.warn('Volume meter initialization skipped:', err);
        }
      }

      // Initialize MediaRecorder
      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : '';

      this.mediaRecorder = mimeType
        ? new MediaRecorder(this.stream, { mimeType })
        : new MediaRecorder(this.stream);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(100);
      this.isRecording = true;

      // Initialize Web Speech Recognition if available
      const SpeechRecognitionClass =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognitionClass) {
        try {
          this.recognition = new SpeechRecognitionClass();
          this.recognition.lang = 'en-US';
          this.recognition.continuous = true;
          this.recognition.interimResults = true;

          this.recognition.onresult = (event: any) => {
            let finalStr = '';
            for (let i = 0; i < event.results.length; i++) {
              finalStr += event.results[i][0].transcript + ' ';
            }
            this.recognizedTranscript = finalStr.trim();
          };

          this.recognition.onerror = (e: any) => {
            console.warn('Speech recognition notice:', e.error);
          };

          this.recognition.start();
        } catch (e) {
          console.warn('SpeechRecognition failed to start:', e);
        }
      }

      return true;
    } catch (error) {
      console.error('Error starting microphone recording:', error);
      this.isRecording = false;
      return false;
    }
  }

  stopRecording(): Promise<{ audioUrl: string; transcript: string; blob: Blob }> {
    return new Promise((resolve) => {
      this.isRecording = false;

      if (this.animFrameId) {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }
      if (this.audioContext) {
        this.audioContext.close().catch(() => {});
        this.audioContext = null;
      }

      if (this.recognition) {
        try {
          this.recognition.stop();
        } catch (e) {}
        this.recognition = null;
      }

      if (!this.mediaRecorder) {
        resolve({
          audioUrl: '',
          transcript: this.recognizedTranscript,
          blob: new Blob(),
        });
        return;
      }

      this.mediaRecorder.onstop = () => {
        const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
        const audioBlob = new Blob(this.audioChunks, { type: mimeType });
        const audioUrl = URL.createObjectURL(audioBlob);

        // Stop all audio stream tracks
        if (this.stream) {
          this.stream.getTracks().forEach((track) => track.stop());
          this.stream = null;
        }

        resolve({
          audioUrl,
          transcript: this.recognizedTranscript,
          blob: audioBlob,
        });
      };

      try {
        if (this.mediaRecorder.state !== 'inactive') {
          this.mediaRecorder.stop();
        }
      } catch (e) {
        console.warn('MediaRecorder stop error:', e);
      }
    });
  }
}
