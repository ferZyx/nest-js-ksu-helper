import { forwardRef, Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { MongooseModule } from '@nestjs/mongoose'
import { RolesModule } from '../roles/roles.module'
import { User, UserSchema } from '../schemas/user.schema'
import { Role, RoleSchema } from '../schemas/role.schema'
import { AuthModule } from '../auth/auth.module'

@Module({
	controllers: [UsersController],
	exports: [UsersService],
	imports: [
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Role.name, schema: RoleSchema }
		]),
		RolesModule,
		forwardRef(() => AuthModule)
	],
	providers: [UsersService]
})
export class UsersModule {}
