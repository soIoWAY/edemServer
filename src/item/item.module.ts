import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
@Module({
  controllers: [ItemController],
  providers: [ItemService, PrismaService],
})
export class ItemModule {}
