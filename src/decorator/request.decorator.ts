import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { iterate } from 'iterare';

export const RequestHeader = createParamDecorator(
  async (value: ClassConstructor<any>, ctx: ExecutionContext) => {
    const headers = ctx.switchToHttp().getRequest().headers;
    const headerDto = plainToInstance(value, headers, {
      excludeExtraneousValues: true,
      exposeUnsetFields: false,
    });

    await validateOrReject(headerDto).catch(
      (validationErrors: ValidationError[]) => {
        const flattenError = iterate(validationErrors)
          .filter((item) => !!item.constraints)
          .map((item) => Object.values(item.constraints))
          .flatten()
          .toArray();
        throw new BadRequestException(flattenError);
      },
    );

    return headerDto;
  },
);
