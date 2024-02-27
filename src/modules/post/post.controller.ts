import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  UploadedFiles,
  Query,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { RequestWithUser } from 'src/types/requests.type';
import {
  ApiBodyWithMultipleFiles,
  ApiDocsPagination,
} from 'src/decorators/swagger-form-data.decorator';

@Controller('posts')
@ApiTags('posts')
@UseGuards(JwtAccessTokenGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiOperation({
    summary: 'User create their post',
  })
  @ApiBearerAuth('token')
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       title: {
  //         type: 'string',
  //         default: 'Learn Kitchen Vocabulary',
  //       },
  //       content: {
  //         type: 'string',
  //         default: 'Learn Kitchen Vocabulary',
  //       },
  //       images: {
  //         type: 'array',
  //         items: {
  //           type: 'string',
  //           format: 'binary',
  //         },
  //       },
  //     },
  //     required: ['title', 'content'],
  //   },
  // })
  // @UseInterceptors(FilesInterceptor('images'))
  @ApiBodyWithMultipleFiles(
    'images', // <--- Tên của property chứa file
    {
      // <--- Các property còn lại của request payload
      title: {
        type: 'string',
        default: 'Learn Kitchen Vocabulary',
      },
      content: {
        type: 'string',
        default: 'Learn Kitchen Vocabulary',
      },
      images: {
        type: 'array',
        items: {
          type: 'string',
          format: 'binary',
        },
      },
    },
    ['title', 'content'], // <--- Các trường bắt buộc
  )
  create(
    @Req() request: RequestWithUser,
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postService.createPost(
      {
        ...createPostDto,
        user: request.user.id,
      },
      images,
    );
  }

  @Get()
  @ApiDocsPagination('collection')
  @ApiBearerAuth('token')
  findAll(
    @Query('offset', ParseIntPipe) offset: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    console.log('offset', offset);
    console.log('limit', limit);
    return this.postService.findAll();
  }

  @Patch('queue/state')
  @ApiQuery({
    name: 'state',
    enum: ['PAUSE', 'RESUME'],
  })
  pauseOrResumeQueue(@Query('state') state: string) {
    return this.postService.pauseOrResumeQueue(state);
  }
}
