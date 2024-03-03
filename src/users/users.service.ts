import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { User, UserDocument } from '../schemas/user.schema'
import { CreateUserDto } from './dto/create-user.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { RolesService } from '../roles/roles.service'
import { RoleDocument } from '../schemas/role.schema'
import { GroupsService } from '../groups/groups.service'
import { GroupDocument } from '../schemas/group.schema'
import { NotificationsService } from '../notifications/notifications.service'
import { NotificationDocument } from '../schemas/notification.schema'

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<UserDocument>,
		private readonly roleService: RolesService,
		private readonly groupService: GroupsService,
		private readonly notificationsService: NotificationsService
	) {}

	getAll(): Promise<UserDocument[]> {
		return this.userModel.find().exec()
	}

	async createUser(dto: CreateUserDto): Promise<UserDocument> {
		const candidate: UserDocument = await this.findUserByEmail(dto.email)
		if (candidate) {
			throw new HttpException(
				'Пользователь с таким email уже зарегистрирован!',
				HttpStatus.CONFLICT
			)
		}

		const userRole: RoleDocument = await this.roleService.getRoleByName('User')
		return await this.userModel.create({
			...dto,
			roles: [userRole._id]
		})
	}

	async findUserByEmail(email: string): Promise<UserDocument> {
		return this.userModel.findOne({ email })
	}

	async findUserById(id: string): Promise<UserDocument> {
		return this.userModel.findById(id)
	}

	async getMe(request: Request) {
		const userId = request['user'].id

		const userData: UserDocument = await this.findUserById(userId)
		const userGroup: GroupDocument =
			await this.groupService.getGroupForUser(userId)
		const userNotifications =
			await this.notificationsService.findByUserId(userId)
		return {
			...userData.toObject(),
			group: userGroup.toObject(),
			notifications: userNotifications.map(
				(notification: NotificationDocument) => notification.toObject()
			)
		}
	}
}
