import { Injectable } from '@nestjs/common';
import { CreateRequestDto } from '../dto/create-request.dto';
import { UpdateRequestDto } from '../dto/update-requests.dto';
import { FilterRequestsDto } from '../dto/filter-requests.dto';
import { Cron } from '@nestjs/schedule';
import { RequestRepository } from '../repositories/request.repository';

@Injectable()
export class RequestsService {
  constructor(private readonly requestRepository: RequestRepository) {}

  async create(createRequestDto: CreateRequestDto, user: any) {
    createRequestDto.userUuid = user.uuid;

    const request = await this.requestRepository.create(createRequestDto);

    return { message: 'Request created successfully', data: request };
  }

  async find(query: FilterRequestsDto) {
    query.paginate = query.paginate || 10;
    query.page = query.page || 1;

    const { data, total } = await this.requestRepository.find(query);

    return {
      data,
      total,
      page: query.page,
      limit: query.paginate,
      hasNextPage: query.page < total,
      hasPreviousPage: query.page > 1,
    };
  }

  async findOne(_id: string, user: any) {
    const request = await this.requestRepository.findOne(_id, user.uuid);

    return { data: request };
  }

  async updateOne(_id: string, updateRequestDto: UpdateRequestDto, user: any) {
    const request = await this.requestRepository.updateOne(
      _id,
      user.uuid,
      updateRequestDto,
    );

    return { message: 'Request updated successfully', data: request };
  }

  @Cron('0 0 */3 * *')
  async updateMany() {
    return await this.requestRepository.updateMany();
  }

  async delete(_id: string, user: any) {
    const request = await this.requestRepository.delete(_id, user.uuid);

    return { message: 'Request deleted successfully', data: request };
  }
}
