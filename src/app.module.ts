import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { YoutubeDownloaderService } from './youtube-downloader/youtube-downloader.service';
import { SocketgatewayGateway } from './socketgateway/socketgateway.gateway';
import { VideoService } from './video/video.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthController } from './user/auth/auth.controller';
import { UserModule } from './user/user.module';
import { AuthService } from './user/auth/auth.service';
import { UserInterceptor } from './user/interceptors/user.interceptor';
import { UserService } from './user/user.service';

@Module({
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    YoutubeDownloaderService,
    SocketgatewayGateway,
    VideoService,
    PrismaService,
    AuthService,
    UserService,
    {
      provide: 'APP_INTERCEPTOR',
      useClass: UserInterceptor,
    }
  ],
  imports: [PrismaModule, UserModule],
})
export class AppModule {}
