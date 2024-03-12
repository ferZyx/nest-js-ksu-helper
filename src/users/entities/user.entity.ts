export class UserEntity {
	// @ApiProperty({ example: 'user@gmail.com', description: 'Почтовый адрес' })
	// readonly email: string
	//
	// @Transform(({ value }) => value?.toString() || null)
	// readonly group: Types.ObjectId
	//
	readonly groupRole: string

	// @Type(() => UserNotificationEntity)
	// readonly notifications: Notification[]

	// @ApiProperty({ example: '123123', description: 'Пароль' })
	// @Exclude()
	// readonly password: string
	//
	// @ApiProperty({
	// 	example: '6597d87f09da1c01b87fe7d7',
	// 	description: 'Уникальный идентификатор'
	// })
	// @Transform(({ value }) => value?.toString())
	// readonly _id: Types.ObjectId

	// @ApiProperty({
	// 	example: 'User',
	// 	description: 'Роли пользователя',
	// 	type: [RoleEntity]
	// })
	// @Transform(({ value }) => value.map((role: { name: string }) => role.name))
	// @Type(() => RoleEntity)
	// readonly roles: RoleEntity[]

	// @Exclude()
	// readonly __v: number

	constructor(partial: Partial<UserEntity>) {
		Object.assign(this, partial)
	}
}
