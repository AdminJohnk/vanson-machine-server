import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PostsRepository } from '@repositories/post.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './entities/post.entity';
import { BullModule } from '@nestjs/bullmq';
import { ImageOptimizationProcessor } from './queues/image-optimization.processor';
import { ImageVerificationProcessor } from './queues/image-verification.processtor';
import { ImageUploadingProcessor } from './queues/image-uploading.processor';
// import { join } from 'path';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    BullModule.registerQueue({
      name: 'image:optimize',
      prefix: 'posts',
    }),
    BullModule.registerQueue({
      name: 'image:check-valid',
      prefix: 'posts',
    }),
    BullModule.registerQueue({
      name: 'image:upload',
      prefix: 'posts',
    }),
    BullModule.registerFlowProducer({
      name: 'image:upload',
      prefix: 'posts',
    }),
  ],
  controllers: [PostController],
  providers: [
    PostService,
    { provide: 'PostsRepositoryInterface', useClass: PostsRepository },
    ImageOptimizationProcessor,
    ImageVerificationProcessor,
    ImageUploadingProcessor,
  ],
  exports: [PostService],
})
export class PostModule {}
