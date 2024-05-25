import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '@modules/users/schemas/users.schema';
import { UserRoles } from '@constants/user-roles.constant';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async getStatistics(query: any) {
    query.paginate = query.paginate || 15;
    query.page = query.page || 1;
    const skip = (query.page - 1) * query.paginate;

    const matchCriteria = {
      role: { $in: [UserRoles.AGENT, UserRoles.CLIENT] },
    };

    const totalCount = await this.userModel.countDocuments(matchCriteria);

    const results = await this.userModel
      .aggregate([
        { $match: matchCriteria },
        { $skip: skip },
        { $limit: query.paginate },
        {
          $lookup: {
            from: 'ads',
            localField: 'uuid',
            foreignField: 'userUuid',
            as: 'ads',
          },
        },
        {
          $lookup: {
            from: 'requests',
            localField: 'uuid',
            foreignField: 'userUuid',
            as: 'requests',
          },
        },
        {
          $addFields: {
            adsCount: { $size: '$ads' },
            totalAdsAmount: { $sum: '$ads.price' },
            requestsCount: { $size: '$requests' },
            totalRequestsAmount: { $sum: '$requests.price' },
          },
        },
        {
          $project: {
            password: 0,
            salt: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
            ads: 0,
            requests: 0,
          },
        },
      ])
      .exec();

    const totalPages = Math.ceil(totalCount / query.paginate);

    return {
      data: results,
      page: query.page,
      limit: query.paginate,
      total: totalCount,
      hasNextPage: query.page < totalPages,
      hasPreviousPage: query.page > 1,
    };
  }
}
