import { UserRole } from '@modules/user-roles/entities/user-role.entity';
import { GENDER, LANGUAGES, User } from '@modules/users/entities/user.entity';

export const createUserStub = (): User => {
  return {
    _id: '643d0fb80a2f99f4151176c4',
    friendly_id: 1,
    email: 'johndoe@example.com',
    first_name: 'John',
    last_name: 'Doe',
    password: 'strongestP@ssword',
    username: 'johndoe',
    gender: GENDER.MALE,
    role: 'admin' as unknown as UserRole,
    fullName: 'John Doe',
    interested_languages: [LANGUAGES.ENGLISH, LANGUAGES.FRENCH],
    phone_number: '1234567890',
    avatar: 'avatar.jpg',
    date_of_birth: new Date('1990-01-01'),
    point: 0,
    address: [
      {
        street: '1234 Elm Street',
        state: 'CA',
        city: 'Los Angeles',
        postal_code: 90001,
        country: 'USA',
      },
    ],
    stripe_customer_id: '',
    current_refresh_token: '',
  };
};
