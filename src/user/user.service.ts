import { HttpException, Injectable } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient } from '@prisma/client';
import { List } from 'microsoft-cognitiveservices-speech-sdk/distrib/lib/src/common/List';
import transcriptionDto from './dtos/transcription.dto';

@Injectable()
export class UserService {
  private mogngoClient: PrismaClient;
  private postgresClient: PrismaClient;

  constructor(
    private readonly authService: AuthService,
    private readonly prismaService: PrismaService,
  ) {
    this.mogngoClient = this.prismaService.getMongoClient();
    this.postgresClient = this.prismaService.getPostgresClient();
  }

  
  async getUserHistory(id: string): Promise<List<transcriptionDto>> {    

    const history = await this.postgresClient.transcription.findMany({
      where: {
        userId: id,
      },
    })
    .catch((err) => {
        console.log(err);
        return "Something went wrong"
    })
    
    return history;
  }

  async getTranscriptionById(id: string): Promise<transcriptionDto> {
    const transcription = await this.postgresClient.transcription.findUnique({
      where: {
        id,
      },
    })
    .catch((err) => {
        console.log(err);
        return "Something went wrong"
    })

    return transcription;
  }

  async createNewTranscription(videoUrl: string, transcription: string, userId: string, title: string) {
    await this.postgresClient.transcription.create({
        data: {
            videoUrl,
            title,
            text: transcription,
            userId,
        }
    })
    .then((res) => {
        return "success"
    })
    .catch((err) => {
        console.log(err);
        return "error"
    })
  }

}
