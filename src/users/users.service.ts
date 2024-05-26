import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { User, UserDocument } from '../schemas/user.schema'
import { CreateUserDto } from './dto/create-user.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { RolesService } from '../roles/roles.service'
import { RoleDocument } from '../schemas/role.schema'
import { GroupRolesEnum } from '../schemas/group.schema'

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<UserDocument>,
		private readonly roleService: RolesService
	) {}

	getAll(): Promise<UserDocument[]> {
		return this.userModel
			.find()
			.populate('roles')
			.populate('notifications')
			.exec()
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

	async addNotificationToUser(
		userId: string,
		notificationId: string
	): Promise<UserDocument> {
		return this.userModel
			.findOneAndUpdate(
				{ _id: userId },
				{ $push: { notifications: notificationId } }
			)
			.exec()
	}

	async findUserByEmail(email: string): Promise<UserDocument> {
		return this.userModel.findOne({ email }).populate('roles')
	}

	async findUserById(id: string): Promise<UserDocument> {
		return this.userModel
			.findById(id)
			.populate('roles')
			.populate('notifications')
	}

	async findUsersByGroupId(groupId: string): Promise<UserDocument[]> {
		return this.userModel.find({ group: groupId })
	}

	async getMe(request: Request) {
		const userId = request['user'].id

		return this.userModel
			.findById(userId)
			.populate('roles testsCreated')
			.populate('notifications')
			.exec()
	}

	async remove(id: string) {
		return this.userModel.findByIdAndDelete(id).exec()
	}

	async leaveGroup(userId: string): Promise<UserDocument> {
		const user: UserDocument = await this.findUserById(userId)
		if (!user.group) {
			throw new HttpException('User is not in a group', HttpStatus.BAD_REQUEST)
		}
		if (user.groupRole === GroupRolesEnum.owner) {
			throw new HttpException(
				'Owner cannot leave the group',
				HttpStatus.BAD_REQUEST
			)
		}
		return this.userModel
			.findByIdAndUpdate(
				userId,
				{ group: null, groupRole: null },
				{ new: true }
			)
			.populate('roles')
			.populate('notifications')
			.exec()
	}
}
