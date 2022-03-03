import { StorageItemRepository } from '../../../repositories';
import { TokenService } from '../../../services';
import { UseCase } from '../../../shared/use-case-lib';
import { InvalidRequestError, NotExistError } from '../../../shared/utils/errors';
import { DownloadFileRequestDTO } from './download-file-request-DTO';
import { DownloadFileResponseDTO } from './download-file-response-DTO';

export class DownloadFileUseCase implements UseCase<DownloadFileRequestDTO, DownloadFileResponseDTO> {
  private readonly _storageItemRepository: StorageItemRepository;
  private readonly _tokenService: TokenService;

  constructor(storageItemRepository: StorageItemRepository, tokenService: TokenService) {
    this._storageItemRepository = storageItemRepository;

    this._tokenService = tokenService;
  }

  public async handle(dto: DownloadFileRequestDTO): Promise<DownloadFileResponseDTO> {
    const fileIdFromToken = this._tokenService.verifyDownloadFileToken(dto.downloadFileToken);

    if (fileIdFromToken !== dto.id) throw new InvalidRequestError('the download file token is invalid.');

    const fileToDownload = await this._storageItemRepository.findOneById(dto.id);

    if (!fileToDownload) {
      throw new NotExistError('the file does not exist.');
    }

    if (fileToDownload.isInTrash) {
      throw new InvalidRequestError('the file is in a trash.');
    }

    const responseDto: DownloadFileResponseDTO = {
      name: fileToDownload.name,
      mimeType: fileToDownload.mimeType!,
      filePath: fileToDownload.filePath!,
      fileSize: fileToDownload.fileSize!,
      fileInitializationVector: fileToDownload.initializationVector!,
    };

    return responseDto;
  }
}
