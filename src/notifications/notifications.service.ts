import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateNotificationDto } from './dto/create-notification.dto'
import { UpdateNotificationDto } from './dto/update-notification.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import {
	Notification,
	NotificationDocument
} from '../schemas/notification.schema'

@Injectable()
export class NotificationsService {
	constructor(
		@InjectModel(Notification.name)
		private readonly notificationModel: Model<NotificationDocument>
	) {}

	async create(
		createNotificationDto: CreateNotificationDto
	): Promise<NotificationDocument> {
		return this.notificationModel.create(createNotificationDto)
	}

	createRequestAcceptedNotification(
		userId: string,
		groupId: string
	): Promise<NotificationDocument> {
		return this.notificationModel.create({
			title: 'Request Accepted',
			message: `Your request to join group ${groupId} has been accepted`,
			user: userId
		})
	}

	findAll(): Promise<NotificationDocument[]> {
		return this.notificationModel.find()
	}

	async findOne(id: string): Promise<NotificationDocument> {
		console.log('id', id)
		const notification: NotificationDocument =
			await this.notificationModel.findById(id)
		console.log(notification)
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

	async remove(id: string): Promise<NotificationDocument> {
		const deletedNotification = await this.notificationModel
			.findByIdAndDelete(id)
			.exec()
		if (!deletedNotification) {
			throw new NotFoundException('Notification not found')
		}
		return
	}

	findByUserId(userId: string): Promise<NotificationDocument[]> {
		return this.notificationModel.find({ user: userId }).exec()
	}
}
