import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class ItemDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  public name: string;

  @IsNumber()
  @IsNotEmpty()
  public price: number;

  @IsString()
  @IsNotEmpty()
  @Length(1, 10)
  public item_type: string;

  @IsString()
  @IsNotEmpty()
  public photo: string;
}
