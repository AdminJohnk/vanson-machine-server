import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import MongooseClassSerializerInterceptor from 'src/interceptors/mongoose-class-serializer.interceptor';
import { User } from './entities/user.entity';
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import { Public } from 'src/decorators/auth.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { USER_ROLE } from '@modules/user-roles/entities/user-role.entity';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@UseInterceptors(MongooseClassSerializerInterceptor(User))
@Controller('users')
@ApiTags('users')
@UseGuards(JwtAccessTokenGuard)
export class UsersController {
  constructor(private readonly users_service: UsersService) {}

  @Post()
  @Public()
  @ApiOperation({
    summary: 'Admin create new user',
    description: `
  * Only admin can use this API

  * Admin create user and give some specific information`,
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.users_service.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.users_service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.users_service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.users_service.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(USER_ROLE.ADMIN) // Những role nào được phép truy cập
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  remove(@Param('id') id: string) {
    return this.users_service.remove(id);
  }
}
