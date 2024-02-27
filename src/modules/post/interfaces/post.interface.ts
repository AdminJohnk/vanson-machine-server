import { BaseRepositoryInterface } from '@repositories/base/base.interface.repository';
import { Post } from '../entities/post.entity';

export type PostsRepositoryInterface = BaseRepositoryInterface<Post>;
