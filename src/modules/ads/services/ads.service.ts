import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAdsDto } from '../dto/create-ads.dto';
import { UpdateAdsDto } from '../dto/update-ads.dto';
import { FilterAdsDto } from '../dto/filter.dto';
import { RequestsService } from '@modules/requests/services/requests.service';
import { AdRepository } from '../repositories/ad.repository';

@Injectable()
export class AdsService {
  constructor(
    private readonly adRepository: AdRepository,
    private readonly requestsService: RequestsService,
  ) {}

  async create(createAdsDto: CreateAdsDto, user: any) {
    createAdsDto.userUuid = user.uuid;
    const ad = await this.adRepository.create(createAdsDto);

    return { message: 'Ad created successfully', data: ad };
  }

  async find(query: FilterAdsDto, user: any) {
    query.paginate = query.paginate || 10;
    query.page = query.page || 1;

    const { ads, totalCount } = await this.adRepository.find(query, user.uuid);
    const totalPages = Math.ceil(totalCount / query.paginate);

    return {
      data: ads,
      total: totalCount,
      page: query.page,
      limit: query.paginate,
      hasNextPage: query.page < totalPages,
      hasPreviousPage: query.page > 1,
    };
  }

  async findMatch(_id: string, query: FilterAdsDto, user: any) {
    const ad = await this.adRepository.findOne(_id, user.uuid);

    // Filter Query
    query.filter = {};
    query.filter.area = ad.area;
    query.filter.district = ad.district;
    query.filter.price = ad.price;

    return await this.requestsService.find(query);
  }

  async findOne(_id: string, user: any) {
    const ad = await this.adRepository.findOne(_id, user.uuid);
    return { data: ad };
  }

  async updateOne(_id: string, updateAdsDto: UpdateAdsDto, user: any) {
    try {
      const ad = await this.adRepository.updateOne(
        _id,
        user.uuid,
        updateAdsDto,
      );

      return { message: 'Ad updated successfully', data: ad };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async delete(_id: string, user: any) {
    const ad = await this.adRepository.delete(_id, user.uuid);
    return { message: 'Ad deleted successfully', data: ad };
  }
}
