import { PartialType } from '@nestjs/mapped-types';
import { CreateTourismPointDto } from './create-tourism-point.dto';

export class UpdateTourismPointDto extends PartialType(CreateTourismPointDto) {}
