import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as nunjucks from 'nunjucks';
import { join } from 'path';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    
    // Configure Nunjucks templating engine
    nunjucks.configure(join(__dirname, '..', '..', 'dist', 'public'), {
        autoescape: true,
        express: app,
    });
    app.useStaticAssets(join(__dirname, '..', '..', 'dist', 'public'));
    await app.listen(3000);
}
bootstrap();