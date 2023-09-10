import { Injectable } from '@nestjs/common';
import * as ytdl from 'ytdl-core';

interface videoInfo {
  url: string;
  title: string;
  length: string;
}

@Injectable()
export class YoutubeDownloaderService {
  // this service will mainly be responsible for downloading the youtube video

  async downloadVideo(videoUrl: string, id: string): Promise<videoInfo> {
    const videoInfo = await ytdl.getBasicInfo(videoUrl);

    const videoTitle = videoInfo.videoDetails.title;
    const videoDuration = videoInfo.videoDetails.lengthSeconds;
    

    // const audio = ytdl.filterFormats(videoInfo.formats, 'audioonly')[0];
    const audio = videoInfo.formats[0].url
    
    

    return {
      url: audio,
      title: videoTitle,
      length: videoDuration,
    };
  }
}
