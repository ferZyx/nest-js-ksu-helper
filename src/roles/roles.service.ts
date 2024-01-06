import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateRoleDto } from './dto/create-role.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Role, RoleDocument } from '../schemas/role.schema'

@Injectable()
export class RolesService {
	constructor(
		@InjectModel(Role.name)
		private readonly roleModel: Model<RoleDocument>
	) {}

	async createRole(dto: CreateRoleDto): Promise<RoleDocument> {
		const existedRole = await this.roleModel.findOne({ name: dto.name })
		if (existedRole) {
			throw new HttpException('Такая роль уже существует', HttpStatus.CONFLICT)
		}
		return this.roleModel.create(dto)
	}

	// Загуглить что возвращать при удалении и как
	async deleteRole(dto: CreateRoleDto) {
		const deletedRole = await this.roleModel.findOneAndDelete({
			name: dto.name
		})
		if (!deletedRole) {
			throw new HttpException('Роль не найдена', HttpStatus.NOT_FOUND)
		}
		return
	}

	async getRoleByName(name: string): Promise<RoleDocument> {
		const role = await this.roleModel.findOne({ name })
		if (!role) {
			throw new HttpException('Роль не найдена', HttpStatus.NOT_FOUND)
		}
		return role
	}
}
