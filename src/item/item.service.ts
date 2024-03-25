import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ItemDto } from './dto/item.dto';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}

  getAll(
    sort: string,
    priceFromURL: string,
    priceToURL: string,
    itemType?: string,
  ) {
    let orderBy = {};
    if (sort === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (sort === 'price_asc') {
      orderBy = { price: 'asc' };
    }

    const priceFrom = parseInt(priceFromURL);
    const priceTo = parseInt(priceToURL);
    let priceFilter = {};
    if (!isNaN(priceFrom) && !isNaN(priceTo)) {
      priceFilter = {
        AND: [{ price: { gte: priceFrom } }, { price: { lte: priceTo } }],
      };
    } else if (!isNaN(priceTo)) {
      priceFilter = {
        price: { lte: priceTo },
      };
    } else if (!isNaN(priceFrom)) {
      priceFilter = {
        price: { gte: priceFrom },
      };
    }

    let where = { ...priceFilter };
    if (itemType === 'bouquet') {
      where = { ...where, item_type: 'bouquet' };
    } else if (itemType === 'box') {
      where = { ...where, item_type: 'box' };
    }
    return this.prisma.item.findMany({
      orderBy: orderBy,
      where: where,
    });
  }

  async addItem(dto: ItemDto) {
    const { name, price, item_type, photo } = dto;

    await this.prisma.item.create({
      data: {
        name,
        price,
        item_type,
        photo,
      },
    });
    return { message: 'successfully' };
  }

  async deleteItemById(id: number) {
    return this.prisma.item.delete({
      where: {
        id: id,
      },
    });
  }
}
