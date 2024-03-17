import {
	forwardRef,
	Inject,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { UpdateNotificationDto } from './dto/update-notification.dto'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import {
	Notification,
	NotificationDocument
} from '../schemas/notification.schema'
import { CreateNotificationDto } from './dto/create-notification.dto'
import { UsersService } from '../users/users.service'
import { UserDocument } from '../schemas/user.schema'

@Injectable()
export class NotificationsService {
	constructor(
		@InjectModel(Notification.name)
		private readonly notificationModel: Model<NotificationDocument>,
		@Inject(forwardRef(() => UsersService))
		private readonly usersService: UsersService
	) {}

	async create({
		userId,
		title,
		message
	}: CreateNotificationDto): Promise<NotificationDocument> {
		const isValid = mongoose.Types.ObjectId.isValid(userId)
		if (!isValid) {
			throw new NotFoundException('User not found')
		}
		const user: UserDocument = await this.usersService.findUserById(userId)
		if (!user) {
			throw new NotFoundException('User not found')
		}
		const notification: NotificationDocument =
			await this.notificationModel.create({ title, message })
		await this.usersService.addNotificationToUser(user._id, notification._id)
		return notification
	}

	// createRequestAcceptedNotification(
	// 	userId: string,
	// 	groupId: string
	// ): Promise<NotificationDocument> {
	// 	return this.notificationModel.create({
	// 		title: 'Request Accepted',
	// 		message: `Your request to join group ${groupId} has been accepted`,
	// 		user: userId
	// 	})
	// }

	findAll(): Promise<NotificationDocument[]> {
		return this.notificationModel.find().exec()
	}

	async findOne(id: string): Promise<NotificationDocument> {
		const notification: NotificationDocument =
			await this.notificationModel.findById(id)
		if (!notification) {
			throw new NotFoundException('Notification not found')
		}
		return notification
	}

	async update(id: string, updateNotificationDto: UpdateNotificationDto) {
		const notification = await this.notificationModel
			.findByIdAndUpdate(id, updateNotificationDto, { new: true })
			.exec()
		if (!notification) {
			throw new NotFoundException('Notification not found')
		}
		return notification
	}

	async remove(id: string, userId: string): Promise<NotificationDocument> {
		const user: UserDocument = await this.usersService.findUserById(userId)
		if (!user) {
			throw new NotFoundException('User not found')
		}
		const userHaveNotification = user.notifications.some(
			(notification: NotificationDocument) =>
				notification._id.toString() === id.toString()
		)
		if (!userHaveNotification) {
			throw new NotFoundException('Notification not found')
		}
		user.notifications = user.notifications.filter(
			(notification: NotificationDocument) =>
				notification._id.toString() !== id.toString()
		)
		await user.save()

		const deletedNotification: NotificationDocument =
			await this.notificationModel.findByIdAndDelete(id).exec()
		if (!deletedNotification) {
			throw new NotFoundException('Notification not found')
		}
		return
	}
}
