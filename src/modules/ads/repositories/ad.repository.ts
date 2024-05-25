import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAdsDto } from '../dto/create-ads.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Ad } from '../schemas/ads.schema';
import { Model } from 'mongoose';
import { UpdateAdsDto } from '../dto/update-ads.dto';
import { FilterAdsDto } from '../dto/filter.dto';

@Injectable()
export class AdRepository {
  constructor(
    @InjectModel(Ad.name)
    private readonly adModel: Model<Ad>,
  ) {}

  async create(createAdsDto: CreateAdsDto) {
    try {
      const ad = await this.adModel.create(createAdsDto);
      return await ad.save();
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async find(query: FilterAdsDto, userUuid: string) {
    const skip = (query.page - 1) * query.paginate;

    const ads = await this.adModel
      .find({ userUuid })
      .skip(skip)
      .limit(query.paginate)
      .lean()
      .exec();

    const totalCount = await this.adModel.countDocuments({ userUuid }).exec();

    return { ads, totalCount };
  }

  async findOne(_id: string, userUuid: string) {
    try {
      const ad = await this.adModel
        .findOneAndUpdate(
          { _id, userUuid },
          { refreshedAt: Date.now() },
          { new: true, useFindAndModify: false },
        )
        .lean();
      if (!ad) throw new HttpException('Ad not found', HttpStatus.NOT_FOUND);

      return ad;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  async updateOne(_id: string, userUuid: string, updateAdsDto: UpdateAdsDto) {
    try {
      return await this.adModel.findOneAndUpdate(
        { _id, userUuid },
        updateAdsDto,
        { new: true },
      );
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async delete(_id: string, userUuid: string) {
    try {
      return await this.adModel.findOneAndDelete(
        { _id, userUuid },
        { new: true },
      );
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
