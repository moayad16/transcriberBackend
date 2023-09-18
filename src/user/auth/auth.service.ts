import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { Role } from 'prisma/generated/mongo_client';
import { PrismaClient } from '@prisma/client';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
}

@Injectable()
export class AuthService {
  private mogngoClient: PrismaClient;
  private postgresClient: PrismaClient;

  constructor(private readonly prismaService: PrismaService) {
    this.mogngoClient = this.prismaService.getMongoClient();
    this.postgresClient = this.prismaService.getPostgresClient();
  }

  async register(user: User) {
    const { firstName, lastName, email, password, role } = user;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.mogngoClient.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
      },
    });
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    return token;
  }

  async login({ email, password }: { email: string; password: string }) {
    const user = await this.mogngoClient.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', 401);
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    return token;
  }

  async validateToken(token: string) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user;
    await this.mogngoClient.user
      .findUnique({
        where: { id: decoded['id'] },
      })
      .then((res) => {
        user = res;
      })
      .catch((err) => {
        console.log(err);
        user = 'Something went wrong';
      });

    return user;

  }
}
