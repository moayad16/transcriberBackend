import { Injectable } from '@nestjs/common';
import { PrismaClient as mongoClient } from '../../prisma/generated/mongo_client';
import { PrismaClient as postgresClient } from '../../prisma/generated/postgress_client';
import { PrismaClient } from '@prisma/client';
import {OnModuleDestroy, OnModuleInit} from '@nestjs/common';


@Injectable()
export class PrismaService extends mongoClient implements OnModuleInit, OnModuleDestroy  {

    private mongoClient: PrismaClient;
    private postgresClient: PrismaClient;

    constructor() {
        super();

        this.mongoClient = new mongoClient()

        this.postgresClient = new postgresClient()
    }
    
        async onModuleInit() {
            await this.mongoClient.$connect();
            await this.postgresClient.$connect();
            console.log('Connected to MongoDB and Postgres');
            
        }
    
        async onModuleDestroy() {
            await this.mongoClient.$disconnect();
            await this.postgresClient.$disconnect();
        }

        getMongoClient() {
            return this.mongoClient;
        }

        getPostgresClient() {
            return this.postgresClient;
        }
        
}
