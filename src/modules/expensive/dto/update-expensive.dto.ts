import { PartialType } from '@nestjs/swagger';
import { CreateExpensiveDto } from './create-expensive.dto';

export class UpdateExpensiveDto extends PartialType(CreateExpensiveDto) {}
