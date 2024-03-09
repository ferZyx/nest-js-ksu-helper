import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { RolesModule } from './roles/roles.module'
import { UsersModule } from './users/users.module'
import { GroupsModule } from './groups/groups.module'
import { NotificationsModule } from './notifications/notifications.module'
import * as process from 'process'

@Module({
	imports: [
		ConfigModule.forRoot({ envFilePath: '.env' }),
		MongooseModule.forRoot(process.env.DB_URI, {
			autoIndex: true,
			connectionFactory: (connection) => {
				connection.plugin(require('mongoose-autopopulate'))
				return connection
			}
		}),
		AuthModule,
		RolesModule,
		UsersModule,
		GroupsModule,
		NotificationsModule
	],
	controllers: [],
	providers: []
})
export class AppModule {}
