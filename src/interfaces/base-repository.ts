export abstract class BaseRepository<
  T,
  CreateContactDto = CreateDtoInterface<T>,
> {
  abstract create(entity: CreateContactDto): Promise<T>;
  abstract findOne(filter: Filter<T>, includes?: string[]): Promise<T | null>;
  abstract findMany(filter: Filter<T>, includes?: string[]): Promise<T[]>;
  abstract update(id: string, entity: Partial<T>): Promise<T | null>;
  abstract delete(id: string): Promise<number>;
}

export type Filter<T> = {
  where?: Partial<T>;
  orderBy?: keyof T;
  order?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
};

export type CreateDtoInterface<T> = Omit<
  {
    [K in keyof T]?: T[K];
  },
  keyof DefaultEntityAttributes
>;

type DefaultEntityAttributes = {
  id: string | number;
  createdAt: Date;
  updatedAt: Date;
};
