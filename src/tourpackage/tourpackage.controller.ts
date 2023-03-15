import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, ParseFilePipeBuilder, HttpStatus, ParseIntPipe, Req, Res } from '@nestjs/common';
import { TourpackageService } from './tourpackage.service';
import { CreateTourpackageDto } from './dto/create-tourpackage.dto';
import { UpdateTourpackageDto } from './dto/update-tourpackage.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Request, Response } from 'express';
import { Tourpackage } from './entities/tourpackage.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('tourpackage')
export class TourpackageController {
  constructor(@InjectRepository(Tourpackage) private TourpackageRepo:Repository<Tourpackage>, private readonly tourpackageService: TourpackageService) {}

  @Post('Addpackage')
  @UseInterceptors(
    FileInterceptor('image',{
      storage: diskStorage({
        destination: './CoverImage',
        filename: (req, image, callback) => {
          // const uniqueSuffix = Date.now() + '-' +Math.round(Math.random()*1e9);
          // const ext = extname(image.originalname)
          const filename = `${image.originalname}`;
          callback(null, filename);
        },
      }),
    }),
  )

  async AddTravelPAckage(
    @UploadedFiles()
    file: Express.Multer.File,
    @Req() req: Request,
    @Body() body,
    @Res() res: Response,
    @Body() createTourpackageDto: CreateTourpackageDto) {
    const {
      PkId,
      MainTitle,
      SubTitle,
      Price,
      Location,
      StartDate,
      EndDate,
      TripType,
      Availability,
      TotalDuration,
      PackageOverview,
      Showpackage} = createTourpackageDto;
      const tourpackage = new Tourpackage()
      tourpackage.MainTitle =MainTitle
      tourpackage.PkId=PkId
      tourpackage.SubTitle =SubTitle
      tourpackage.Price =Price
      tourpackage.Location =Location
      tourpackage.Availability =Availability
      tourpackage.StartDate =StartDate
      tourpackage.EndDate =EndDate
      tourpackage.TripType =TripType
      tourpackage.TotalDuration =TotalDuration
      tourpackage.PackageOverview =PackageOverview
      tourpackage.Showpackage =Showpackage
      tourpackage.ImageUrl =file.path
    await this.TourpackageRepo.save(tourpackage);
    return res.status(HttpStatus.OK).send({ status:"success", })
  }

  @Get('getall')
  findAll() {
    return this.tourpackageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tourpackageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTourpackageDto: UpdateTourpackageDto) {
    return this.tourpackageService.update(+id, updateTourpackageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tourpackageService.remove(+id);
  }
}
