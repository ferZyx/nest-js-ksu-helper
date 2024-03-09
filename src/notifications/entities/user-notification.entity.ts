import { Exclude } from 'class-transformer'
import { NotificationEntity } from './notification.entity'
import { Types } from 'mongoose'

export class UserNotificationEntity extends NotificationEntity {
	@Exclude()
	readonly user: Types.ObjectId[]
}
