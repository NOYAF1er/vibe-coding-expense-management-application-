import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HelloService } from './hello.service';
import { HelloResponseDto } from './dto/hello-response.dto';

/**
 * Controller handling Hello endpoints
 */
@ApiTags('hello')
@Controller('hello')
export class HelloController {
  constructor(private readonly helloService: HelloService) {}

  /**
   * Get hello message from database
   */
  @Get()
  @ApiOperation({ summary: 'Get hello message' })
  @ApiResponse({
    status: 200,
    description: 'Hello message retrieved successfully',
    type: HelloResponseDto,
  })
  async getHello(): Promise<HelloResponseDto> {
    return this.helloService.getHello();
  }
}
