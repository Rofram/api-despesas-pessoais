import { ApiProperty } from '@nestjs/swagger';

export type PaginatedEntityData = {
  page: number;
  limit: number;
  total: number;
};

export class PaginatedEntity {
  @ApiProperty()
  total: number;
  @ApiProperty()
  hasMore: boolean;
  @ApiProperty()
  rowCount: number;

  constructor(data: PaginatedEntityData) {
    Object.assign(this, {
      total: data.total,
      hasMore: (data.limit * (data.page + 1)) < data.total,
      rowCount: Math.ceil(data.total / data.limit),
    });
  }
}
