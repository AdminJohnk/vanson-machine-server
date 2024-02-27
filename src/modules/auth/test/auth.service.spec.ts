import { ConfigService } from '@nestjs/config';
import { UsersService } from '@modules/users/users.service';
import { UsersRepository } from '@repositories/users.repository';
import { UserRolesRepository } from '@repositories/user-roles.repository';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '@modules/users/entities/user.entity';
import { UserRole } from '@modules/user-roles/entities/user-role.entity';
import { mockConfigService } from '@modules/auth/test/mocks/config-service.mock';
import { mockJwtService } from './mocks/jwt.mock';
import { UserRolesService } from '@modules/user-roles/user-roles.service';
import { createUserStub } from '@modules/users/test/stubs/user.stub';
import { ConflictException } from '@nestjs/common';
import { SignUpDto } from '../dto/sign-up.dto';
import { mock_access_token, mock_refresh_token } from './mocks/tokens.mock';
import * as bcrypt from 'bcryptjs';

jest.mock('../../users/users.service');
describe('AuthService', () => {
  let auth_service: AuthService;
  let users_service: UsersService;
  let jwt_service: JwtService;
  beforeEach(async () => {
    const module_ref = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        AuthService,
        UsersService,
        UserRolesService,
        {
          provide: 'UsersRepositoryInterface',
          useClass: UsersRepository,
        },
        {
          provide: 'UserRolesRepositoryInterface',
          useClass: UserRolesRepository,
        },
        {
          provide: getModelToken(User.name), // trả về: UserModel
          useValue: {},
        },
        {
          provide: getModelToken(UserRole.name), // trả về: UserRoleModel
          useValue: {},
        },
      ],
    }).compile();
    auth_service = module_ref.get<AuthService>(AuthService);
    users_service = module_ref.get<UsersService>(UsersService);
    jwt_service = module_ref.get<JwtService>(JwtService);
  });
  it('should be defined', () => {
    expect(auth_service).toBeDefined();
  });

  describe('signUp', () => {
    it('should throw a ConflictException if user with email already exists', async () => {
      // Arrange
      jest
        .spyOn(users_service, 'findOneByCondition')
        .mockResolvedValueOnce(createUserStub());
      // Act && Assert
      await expect(auth_service.signUp(createUserStub())).rejects.toThrow(
        ConflictException,
      );
    });
    it('should successfully create and return a new user if email is not taken', async () => {
      // Arrange
      const user_stub = createUserStub();
      const mock_sign_up_dto: SignUpDto = {
        email: 'michaelsmith@example.com',
        first_name: 'Michael',
        last_name: 'Smith',
        password: '123le$$321',
      };
      jest
        .spyOn(users_service, 'findOneByCondition')
        .mockResolvedValueOnce(null);
      jest
        .spyOn(auth_service, 'generateAccessToken')
        .mockReturnValue(mock_access_token);
      jest
        .spyOn(auth_service, 'generateRefreshToken')
        .mockReturnValue(mock_refresh_token);
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementationOnce(() => mock_sign_up_dto.password);
      jest.spyOn(auth_service, 'storeRefreshToken');

      // Act
      const result = await auth_service.signUp(mock_sign_up_dto);

      // Assert
      expect(users_service.create).toHaveBeenCalledWith({
        ...mock_sign_up_dto,
        username: expect.any(String),
      });
      expect(auth_service.generateAccessToken).toHaveBeenCalledWith({
        user_id: user_stub._id,
      });
      expect(auth_service.generateRefreshToken).toHaveBeenCalledWith({
        user_id: user_stub._id,
      });
      expect(auth_service.storeRefreshToken).toBeCalledWith(
        user_stub._id,
        mock_refresh_token,
      );
      expect(result).toEqual({
        access_token: mock_access_token,
        refresh_token: mock_refresh_token,
      });
    });
  });
});
