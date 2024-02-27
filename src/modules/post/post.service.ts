/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable } from '@nestjs/common';
import { Post } from './entities/post.entity';
import { BaseServiceAbstract } from 'src/services/base/base.abstract.service';
import { PostsRepositoryInterface } from './interfaces/post.interface';
import { InjectFlowProducer, InjectQueue } from '@nestjs/bullmq';
import { FlowProducer, Queue } from 'bullmq';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostService extends BaseServiceAbstract<Post> {
  constructor(
    @Inject('PostsRepositoryInterface')
    private readonly posts_repository: PostsRepositoryInterface,
    @InjectQueue('image:optimize')
    private readonly image_optimize_queue: Queue,
    @InjectFlowProducer('image:upload')
    private readonly image_upload_flow: FlowProducer,
  ) {
    super(posts_repository);
  }

  async pauseOrResumeQueue(state: string) {
    if (state !== 'RESUME') {
      return await this.image_optimize_queue.pause();
    }
    return await this.image_optimize_queue.resume();
  }

  async createPost(
    create_dto: CreatePostDto,
    images: Array<Express.Multer.File>,
  ): Promise<Post> {
    const post = await this.posts_repository.create({
      ...create_dto,
      images: images.map((image) => image.originalname),
    });
    // await this.image_optimize_queue.add('optimize-size', {
    //   images,
    //   id: post._id,
    // });

    await this.image_upload_flow.add({
      name: 'uploading-image',
      queueName: 'image:upload',
      data: { id: post._id },
      children: [
        {
          name: 'optimize-size',
          data: { images },
          queueName: 'image:optimize',
          opts: {
            delay: 1000,
          },
        },
        {
          name: 'check-term',
          data: { images },
          queueName: 'image:check-valid',
        },
        {
          name: 'check-policy',
          data: { images },
          queueName: 'image:check-valid',
        },
      ],
    });

    return post;
  }
}
