import { Injectable } from '@nestjs/common';
import * as ffmpeg from 'fluent-ffmpeg';
import {
  AudioConfig,
  ResultReason,
  SpeechRecognizer,
} from 'microsoft-cognitiveservices-speech-sdk';
import { YoutubeDownloaderService } from 'src/youtube-downloader/youtube-downloader.service';
import * as fs from 'fs';

@Injectable()
export class VideoService {
  // the following method will be responsible for determining the sorurce of the video
  constructor(private readonly youtubeDownloader: YoutubeDownloaderService) {}

  findSource(videoUrl: string): string {
    const source = videoUrl.split('.')[1];

    switch (source) {
      case 'youtube':
        return 'youtube';
      case 'twitter' || 'X':
        return 'twitter';
      default:
        return 'unknown';
    }
  }

  async convertToWav(mp3Path: string, wavPath: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      ffmpeg()
        .input(mp3Path)
        .audioCodec('pcm_s16le')
        .audioChannels(1)
        .audioFrequency(44100)
        .format('wav')
        .on('error', function (err) {
          console.error('An error occurred: ' + err);
          reject(err);
        })
        .on('progress', function (progress) {
          console.log('Processing: ' + progress.targetSize + ' KB converted');
        })
        .on('end', function () {
          console.log('Processing finished !');
          resolve(wavPath);
        })
        .saveToFile(wavPath);
    });
  }

  // First step in the transcription process

  async fetchAndDownloadAudio(videoUrl: string, id: string): Promise<Object> {
    const source = this.findSource(videoUrl);
    // console.log(source);

    switch (source) {
      case 'youtube':
        return await this.youtubeDownloader.downloadVideo(videoUrl, id);
      case 'twitter' || 'X':
        break;
      default:
        break;
    }

    // return 'ok';
  }

  async transcribeVideo(
    speechConfig: any, // Replace 'any' with the actual type for speechConfig
    wav: string,
    client: any,
    duration:number,
    id:number
  ): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {

      let percentDone = 0;

        const audioConfig = AudioConfig.fromWavFileInput(fs.readFileSync(wav));
        const recognizer = new SpeechRecognizer(speechConfig, audioConfig);
        let transcription = ""
        let transcriptSlices = duration / 30
        let counter = 0

        recognizer.recognized = (s, e) => {
          if (e.result.reason === ResultReason.RecognizedSpeech) {
            // Write the transcription to a txt file
            transcription += e.result.text
            counter++
            percentDone = Math.floor((counter / transcriptSlices) * 60)
            
            client.emit("status", {id: id, message: "Transcribing audio . . .", percent: percentDone + 30})
          }
        };

        recognizer.canceled = (s, e) => {
          console.error(`Error: ${e.errorDetails}`);
        };

        recognizer.sessionStopped = (s, e) => {
          recognizer.stopContinuousRecognitionAsync();
          resolve(transcription);
        };

        await recognizer.startContinuousRecognitionAsync();

    });
  }
}
