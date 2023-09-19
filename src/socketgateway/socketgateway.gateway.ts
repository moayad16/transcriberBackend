import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { SpeechConfig } from 'microsoft-cognitiveservices-speech-sdk';
import { VideoService } from 'src/video/video.service';
import * as fs from 'fs';
import { AuthService } from 'src/user/auth/auth.service';
import { UserService } from 'src/user/user.service';

interface video {
  url: string;
}

@WebSocketGateway(parseInt(process.env.WEBSOCKET_PORT), {
  cors: {
    origin: 'https://transcriber-io.onrender.com',
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})
export class SocketgatewayGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly videoService: VideoService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  private speechConfig: SpeechConfig;

  afterInit(server: any): any {
    console.log('socket gateway initialized');

    // configure azure services here
    this.speechConfig = SpeechConfig.fromSubscription(
      process.env.AZURE_KEY_2,
      process.env.AZURE_REGION,
    );
    console.log('Configured Azure Services');
  }

  handleConnection(client: any, ...args: any[]): any {
    console.log('client connected');
  }

  handleDisconnect(client: any): any {
    console.log('client disconnected');
  }

  @SubscribeMessage('postUrl')
  async handlePostUrl(client: any, videoUrl: video): Promise<void> {
    const user = await this.authService.validateToken(
      client.handshake.auth.token,
    );

    let percent = 0;
    console.log('received url: ', videoUrl.url);
    const proccessId = new Date().getTime();

    client.emit('status', {
      message: 'Fethcing Video . . .',
      id: proccessId,
      percent: percent,
    });
    try {
      const videoInfo = await this.videoService.fetchAndDownloadAudio(
        videoUrl.url,
        client.id,
      );

      percent += 10;

      client.emit('info', {
        title: videoInfo['title'],
        id: proccessId,
        url: videoUrl,
      });

      client.emit('status', {
        message: "Processing video's audio . . .",
        id: proccessId,
        percent: percent,
      });

      const wavPath = await this.videoService.convertToWav(
        videoInfo['url'],
        `audio_${client.id}.wav`,
      );

      percent += 20;

      client.emit('status', {
        message: 'Transcribing audio . . .',
        id: proccessId,
        percent: percent,
      });

      const transcription = await this.videoService.transcribeVideo(
        this.speechConfig,
        wavPath,
        client,
        videoInfo['length'],
        proccessId,
      );

      client.emit('status', {
        message: 'Finalizing the transcription . . .',
        id: proccessId,
        percent: 95,
      });

      client.emit('transcription', {
        transcript: transcription,
        id: proccessId,
        title: videoInfo['title'],
      });
      client.emit('status', {
        message: 'Done . . .',
        id: proccessId,
        percent: 100,
      });

      client.disconnect();

      // delete the audio file and the transcription file
      fs.unlinkSync(wavPath);

      if (user['id'] !== undefined) {
        await this.userService.createNewTranscription(
          videoUrl.url,
          transcription,
          user['id'],
          videoInfo['title'],
        );
      }
    } catch (err) {
      client.emit('error', {
        message: 'Transcription Failed!',
        id: proccessId,
      });
      console.log(err);
      client.disconnect();
      if (fs.existsSync(`audio_${client.id}.wav`))
        fs.unlinkSync(`audio_${client.id}.wav`);
    }
  }
}
