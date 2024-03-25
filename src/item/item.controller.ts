import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ItemDto } from './dto/item.dto';
import { ItemService } from './item.service';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get('items')
  async getItems(
    @Query('sort') sort: string,
    @Query('priceFrom') priceFrom: string,
    @Query('priceTo') priceTo: string,
    @Query('itemType') itemType: string,
  ) {
    return this.itemService.getAll(sort, priceFrom, priceTo, itemType);
  }

  @Post('additem')
  addItem(@Body() dto: ItemDto) {
    return this.itemService.addItem(dto);
  }

  @Delete('deleteitem/:id')
  deleteItem(@Param('id', ParseIntPipe) id: number) {
    return this.itemService.deleteItemById(id);
  }
}
