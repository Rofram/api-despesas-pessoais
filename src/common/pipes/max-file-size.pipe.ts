import { MaxFileSizeValidator, ParseFilePipe } from '@nestjs/common';

export const MaxFileSizeInMegabitsPipe = (maxFileSizeInMegabits: number) => {
  return new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({
        maxSize: 1024 * 1024 * maxFileSizeInMegabits,
        message: `Max file size is ${maxFileSizeInMegabits}MB`,
      }),
    ],
    fileIsRequired: false,
  });
};
