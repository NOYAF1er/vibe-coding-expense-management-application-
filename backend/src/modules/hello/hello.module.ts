import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelloController } from './hello.controller';
import { HelloService } from './hello.service';
import { HelloEntity } from './hello.entity';

/**
 * Hello feature module
 */
@Module({
  imports: [TypeOrmModule.forFeature([HelloEntity])],
  controllers: [HelloController],
  providers: [HelloService],
})
export class HelloModule {}
