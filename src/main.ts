import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as process from 'process'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
	const PORT = process.env.PORT || 5000
	const app = await NestFactory.create(AppModule)

	if (process.env.NEST_DEBUG === 'true') {
		const config = new DocumentBuilder()
			.setTitle('Апишечка от бога')
			.setDescription('Владик смог запусить сваггер')
			.setVersion('1.0.0')
			.addBearerAuth()
			.build()
		const document = SwaggerModule.createDocument(app, config)
		SwaggerModule.setup('/api/docs', app, document, {
			customSiteTitle: 'Tolyan API Docs',
			swaggerOptions: {
				docExpansion: 'none'
			}
		})
	}

	app.setGlobalPrefix('api')
	app.use(cookieParser())
	app.enableCors({
		credentials: true,
		origin: [
			'https://tolyan.me',
			'http://tolyan.me:3000',
			'http://localhost:3000'
		]
	})

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true
		})
	)

	await app
		.listen(PORT)
		.then(() => console.log(`Server started on ${PORT} port`))
}

bootstrap()
