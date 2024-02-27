import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('image:optimize', {
  // có thể xử lý đồng thời 200 job nhưng tối đa trong 60s chỉ xử lý 200 job
  concurrency: 2,
  lockDuration: 3000,
  limiter: {
    max: 200,
    duration: 60000,
  },
})
export class ImageOptimizationProcessor extends WorkerHost {
  private logger = new Logger();
  @OnWorkerEvent('active')
  onQueueActive(job: Job) {
    this.logger.log(`Job has been started: ${job.id}`);
  }

  @OnWorkerEvent('completed')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onQueueComplete(job: Job, result: any) {
    this.logger.log(`Job has been finished: ${job.id}`);
  }

  @OnWorkerEvent('failed')
  onQueueFailed(job: Job, err: any) {
    this.logger.log(`Job has been failed: ${job.id}`);
    this.logger.log({ err });
  }

  @OnWorkerEvent('error')
  onQueueError(err: any) {
    this.logger.log(`Job has got error: `);
    this.logger.log({ err });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async process(job: Job<any, any, string>, token?: string): Promise<any> {
    switch (job.name) {
      case 'optimize-size':
        const optimzied_image = await this.optimizeImage(job.data);
        return optimzied_image;

      default:
        throw new Error('No job name match');
    }
  }

  async optimizeImage(image: unknown) {
    this.logger.log('Processing image....');
    return await new Promise((resolve) =>
      setTimeout(() => resolve(image), 5000),
    );
  }
}
