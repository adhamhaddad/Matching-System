import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from '../schemas/requests.schema';
import { CreateRequestDto } from '../dto/create-request.dto';
import { UpdateRequestDto } from '../dto/update-requests.dto';
import { FilterRequestsDto } from '../dto/filter-requests.dto';

@Injectable()
export class RequestRepository {
  constructor(
    @InjectModel(Request.name)
    private readonly requestModel: Model<Request>,
  ) {}

  async create(createRequestDto: CreateRequestDto) {
    try {
      const request = await this.requestModel.create(createRequestDto);
      return await request.save();
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async find(query: FilterRequestsDto) {
    const filter = query.filter;
    const skip = (query.page - 1) * query.paginate;

    const priceTolerance = 0.1;
    const minPrice = (filter.price * (1 - priceTolerance)).toFixed();
    const maxPrice = (filter.price * (1 + priceTolerance)).toFixed();

    const matchCriteria = {
      district: { $regex: new RegExp(filter.district, 'i') },
      price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
      area: { $regex: new RegExp(filter.area, 'i') },
    };

    const results = await this.requestModel
      .aggregate([
        { $match: matchCriteria },
        { $sort: { refreshedAt: -1 } },
        { $skip: skip },
        { $limit: query.paginate },
      ])
      .exec();

    const totalCount = await this.requestModel
      .countDocuments(matchCriteria)
      .exec();

    const totalPages = Math.ceil(totalCount / query.paginate);

    return {
      data: results,
      total: totalCount,
      page: query.page,
      limit: query.paginate,
      hasNextPage: query.page < totalPages,
      hasPreviousPage: query.page > 1,
    };
  }

  async findOne(_id: string, userUuid: string) {
    try {
      const request = await this.requestModel
        .findOneAndUpdate(
          { _id, userUuid },
          { refreshedAt: Date.now() },
          { new: true, useFindAndModify: false },
        )
        .lean();
      if (!request)
        throw new HttpException('Request not found', HttpStatus.NOT_FOUND);

      return request;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  async updateMany() {
    // bulk update on each request for any user that his request passed 3 days

    // Calculate the date 3 days ago
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    return await this.requestModel.updateMany(
      { refreshedAt: { $lt: threeDaysAgo } },
      { $set: { refreshedAt: Date.now() } },
    );
  }

  async updateOne(
    _id: string,
    userUuid: string,
    updateRequestDto: UpdateRequestDto,
  ) {
    try {
      return await this.requestModel.findOneAndUpdate(
        { _id, userUuid },
        updateRequestDto,
        { new: true },
      );
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async delete(_id: string, userUuid: string) {
    try {
      return await this.requestModel.findOneAndDelete(
        { _id, userUuid },
        { new: true },
      );
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
