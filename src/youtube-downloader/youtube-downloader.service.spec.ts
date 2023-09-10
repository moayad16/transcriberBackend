import { Test, TestingModule } from '@nestjs/testing';
import { YoutubeDownloaderService } from './youtube-downloader.service';

describe('YoutubeDownloaderService', () => {
  let service: YoutubeDownloaderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YoutubeDownloaderService],
    }).compile();

    service = module.get<YoutubeDownloaderService>(YoutubeDownloaderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
