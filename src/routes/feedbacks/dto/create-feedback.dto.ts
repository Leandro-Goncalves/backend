import { PickType } from '@nestjs/mapped-types';
import { Feedback } from '../entities/feedback.entity';

export class CreateFeedbackDto extends PickType(Feedback, ['name']) {}
