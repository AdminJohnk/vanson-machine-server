import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';
import { PostsRepositoryInterface } from '@modules/post/interfaces/post.interface';
import { Post, PostDocument } from '@modules/post/entities/post.entity';

@Injectable()
export class PostsRepository
  extends BaseRepositoryAbstract<PostDocument>
  implements PostsRepositoryInterface
{
  constructor(
    @InjectModel(Post.name)
    private readonly post_model: Model<PostDocument>,
  ) {
    super(post_model);
  }
}
