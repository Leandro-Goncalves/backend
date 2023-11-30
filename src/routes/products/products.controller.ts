import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UseAuth } from '@/auth/roles.decorator';
import { Roles } from '@/routes/users/entities/user.entity';
import { AuthReq } from '@/types/authReq';
import { HideOrShowDto } from './dto/hide-or-show.dto';
import { ImagesService } from '../images/images.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private imagesService: ImagesService,
  ) {}

  @Get('/search')
  search(@Query('q') query: string, @Query('c') category: string) {
    return this.productsService.search(query, category);
  }

  @Get('category/:categoryUuid')
  findByCategory(@Param('categoryUuid') categoryUuid: string) {
    return this.productsService.findProductsByCategory(categoryUuid);
  }

  @UseAuth([Roles.ADMIN])
  @Post()
  async create(
    @Request() req: AuthReq,
    @Body() createProductDto: CreateProductDto,
  ) {
    const { establishmentUuid } = req.user;
    return this.productsService.create(establishmentUuid, createProductDto);
  }

  @UseAuth([Roles.ADMIN])
  @Post(':id/image')
  @UseInterceptors(FilesInterceptor('images'))
  async addImages(
    @Param('id') id: string,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    const imagesRemoved = await this.productsService.removeImages(id);
    const imagesRemovedPromise = imagesRemoved.map(async ({ imageId }) => {
      await this.imagesService.remove(imageId);
    });
    await Promise.all(imagesRemovedPromise);

    const productImages = await this.productsService.addImages(id, images);

    await Promise.all(
      productImages.map((i) => this.imagesService.create(i.image, i.imageId)),
    );

    return;
  }

  @Get(':establishmentUuid')
  findAll(@Param('establishmentUuid') establishmentUuid: string) {
    return this.productsService.findAll(establishmentUuid);
  }

  @Get(':establishmentUuid/:id')
  findOne(
    @Param('establishmentUuid') establishmentUuid: string,
    @Param('id') id: string,
  ) {
    return this.productsService.findOne(establishmentUuid, id);
  }

  @UseAuth([Roles.ADMIN])
  @Patch(':id')
  async update(
    @Request() req: AuthReq,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const { establishmentUuid } = req.user;

    return this.productsService.update(establishmentUuid, id, updateProductDto);
  }

  @UseAuth([Roles.ADMIN])
  @Delete(':id')
  async remove(@Request() req: AuthReq, @Param('id') id: string) {
    const { establishmentUuid } = req.user;
    const product = await this.productsService.remove(establishmentUuid, id);
    await Promise.all(
      product.Image.map((i) => this.imagesService.remove(i.imageId)),
    );

    return product;
  }

  @UseAuth([Roles.ADMIN])
  @Patch(':id/isActive')
  hideOrShow(@Param('id') id: string, @Body() hideOrShowDto: HideOrShowDto) {
    return this.productsService.hideOrShow(id, hideOrShowDto.isActive);
  }
}
