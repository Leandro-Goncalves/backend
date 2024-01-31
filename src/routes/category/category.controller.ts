import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthReq } from '@/types/authReq';
import { UseAuth } from '@/auth/roles.decorator';
import { Roles } from '@/routes/users/entities/user.entity';
import { LinkProductsDto } from './dto/link-products.dto';
import { ReorderDto } from './dto/reorder.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseAuth([Roles.ADMIN])
  @Post('link/:categoryUuid')
  linkProductsToCategory(
    @Param('categoryUuid') categoryUuid: string,
    @Body() linkProductsDto: LinkProductsDto,
  ) {
    return this.categoryService.linkProductsToCategory(
      linkProductsDto.uuids,
      categoryUuid,
    );
  }

  @UseAuth([Roles.ADMIN])
  @Post()
  create(
    @Request() req: AuthReq,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    const { establishmentUuid } = req.user;
    return this.categoryService.create(establishmentUuid, createCategoryDto);
  }

  @UseAuth([Roles.USER])
  @Get()
  findAllAuthenticated(@Request() req: AuthReq) {
    const { establishmentUuid } = req.user;
    return this.categoryService.findAll(establishmentUuid);
  }

  @Get(':id')
  findAll(@Param('id') id: string) {
    return this.categoryService.findAll(id);
  }

  @UseAuth([Roles.ADMIN])
  @Patch(':id')
  update(
    @Request() req: AuthReq,
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const { establishmentUuid } = req.user;
    return this.categoryService.update(
      establishmentUuid,
      id,
      updateCategoryDto,
    );
  }

  @UseAuth([Roles.ADMIN])
  @Post('reorder')
  reorder(@Body() reorderDto: ReorderDto) {
    return this.categoryService.reorder(reorderDto);
  }

  @UseAuth([Roles.ADMIN])
  @Delete(':id')
  remove(@Request() req: AuthReq, @Param('id') id: string) {
    const { establishmentUuid } = req.user;
    return this.categoryService.remove(establishmentUuid, id);
  }
}
