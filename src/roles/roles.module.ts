import { forwardRef, Module } from '@nestjs/common'
import { RolesService } from './roles.service'
import { MongooseModule } from '@nestjs/mongoose'
import { RolesController } from './roles.controller'
import { Role, RoleSchema } from '../schemas/role.schema'
import { AuthModule } from '../auth/auth.module'

@Module({
	controllers: [RolesController],
	providers: [RolesService],
	imports: [
		MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
		forwardRef(() => AuthModule)
	],
	exports: [RolesService]
})
export class RolesModule {}
