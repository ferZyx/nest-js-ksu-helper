import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import * as process from "process";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
    const PORT = process.env.PORT || 5000
    const app = await NestFactory.create(AppModule);

    const config =  new DocumentBuilder()
        .setTitle("Ето название")
        .setDescription("Владик смог запусить сваггер")
        .setVersion("1.0.0")
        .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('/api/docs', app, document)

    await app.listen(PORT).then(() => console.log(`Server started on ${PORT} port`));
}

bootstrap();
