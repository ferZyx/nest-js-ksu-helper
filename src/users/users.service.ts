import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { User, UserDocument } from '../schemas/user.schema'
import { CreateUserDto } from './dto/create-user.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { RolesService } from '../roles/roles.service'
import { RoleDocument } from '../schemas/role.schema'

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<UserDocument>,
		private readonly roleService: RolesService
	) {}

	getAll(): Promise<UserDocument[]> {
		return this.userModel.find().populate('roles').exec()
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
		const user: UserDocument = await this.userModel.create({
			...dto,
			roles: [userRole._id]
		})
		return user.populate('roles')
	}

	async findUserByEmail(email: string): Promise<UserDocument> {
		return this.userModel.findOne({ email }).populate('roles')
	}

	async findUserById(id: string): Promise<UserDocument> {
		return this.userModel.findById(id).populate('roles')
	}

	async getMe(request: Request): Promise<UserDocument> {
		const userId = request['user'].id
		return this.findUserById(userId)
	}
}
