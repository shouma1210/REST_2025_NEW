import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Card } from './../models/card';
import { CardInstance } from './../models/card_instance';

@Module({
    imports: [
        SequelizeModule.forRoot({
            dialect: 'sqlite',
            storage: 'db.sqlite',
            models: [Card, CardInstance],
            autoLoadModels: true,
            synchronize: true,
            logging: false,
        }),
        SequelizeModule.forFeature([Card, CardInstance]),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}