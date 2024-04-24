import { FileTypeValidator, ParseFilePipe, UploadedFile } from '@nestjs/common';

export const UploadedFileImage = (isRequired = true) => {
  return UploadedFile(
    new ParseFilePipe({
      validators: [new FileTypeValidator({ fileType: 'image/*' })],
      fileIsRequired: isRequired,
    }),
  );
};
