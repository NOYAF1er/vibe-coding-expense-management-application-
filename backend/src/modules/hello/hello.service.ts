import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HelloEntity } from './hello.entity';
import { HelloResponseDto } from './dto/hello-response.dto';

/**
 * Service handling Hello business logic
 */
@Injectable()
export class HelloService {
  constructor(
    @InjectRepository(HelloEntity)
    private readonly helloRepository: Repository<HelloEntity>,
  ) {}

  /**
   * Get or create a hello message from the database
   * This demonstrates real database interaction
   */
  async getHello(): Promise<HelloResponseDto> {
    // Try to find existing hello message
    let hello = await this.helloRepository.findOne({
      where: {},
      order: { id: 'DESC' },
    });

    // If none exists, create one
    if (!hello) {
      hello = this.helloRepository.create({
        message: 'Hello from NestJS!',
      });
      hello = await this.helloRepository.save(hello);
    }

    return {
      id: hello.id,
      message: hello.message,
      timestamp: hello.timestamp,
    };
  }
}
