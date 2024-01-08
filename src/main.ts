import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as process from 'process'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
	const PORT = process.env.PORT || 5000
	const app = await NestFactory.create(AppModule)
	app.enableCors({ credentials: true, origin: 'https://tolyan.me' })
	app.use(cookieParser())
	app.setGlobalPrefix('api')

	const config = new DocumentBuilder()
		.setTitle('Апишечка от бога')
		.setDescription('Владик смог запусить сваггер')
		.setVersion('1.0.0')
		.build()
	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('/api/docs', app, document)

	await app
		.listen(PORT)
		.then(() => console.log(`Server started on ${PORT} port`))
}

bootstrap()
