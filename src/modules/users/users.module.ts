import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { UserRolesModule } from '@modules/user-roles/user-roles.module';
import { UsersRepository } from '@repositories/users.repository';

@Module({
  imports: [
    UserRolesModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: 'UsersRepositoryInterface', useClass: UsersRepository },
  ],
  exports: [UsersService],
})
export class UsersModule {}
