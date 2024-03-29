import { forwardRef, Module } from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { NotificationsController } from './notifications.controller'
import { AuthModule } from '../auth/auth.module'
import { MongooseModule } from '@nestjs/mongoose'
import {
	Notification,
	NotificationSchema
} from '../schemas/notification.schema'
import { UsersModule } from '../users/users.module'

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Notification.name, schema: NotificationSchema }
		]),
		forwardRef(() => AuthModule),
		forwardRef(() => UsersModule)
	],
	controllers: [NotificationsController],
	providers: [NotificationsService],
	exports: [NotificationsService]
})
export class NotificationsModule {}
