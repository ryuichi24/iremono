import { StorageItemRepository } from '../../../repositories';
import { InvalidRequestError, NotExistError } from '../../../shared/utils/errors';
import { IRestoreFileUseCase, RestoreFileRequestDTO, RestoreFileResponseDTO } from './contracts';

export class RestoreFileUseCase implements IRestoreFileUseCase {
  constructor(private readonly _storageItemRepository: StorageItemRepository) {}

  public async handle(dto: RestoreFileRequestDTO): Promise<RestoreFileResponseDTO> {
    const fileToRestore = await this._storageItemRepository.findOneById(dto.id);
    if (!fileToRestore || fileToRestore.isFolder) throw new NotExistError('the file does not exist.');

    if (fileToRestore.ownerId !== dto.ownerId)
      throw new InvalidRequestError(`the owner does not match the folder's owner`);

    const parentFolder = await this._storageItemRepository.findOneById(fileToRestore.parentId!);

    if (parentFolder?.isInTrash) throw new InvalidRequestError('the parent folder is in a trash.');

    fileToRestore.restore();
    await this._storageItemRepository.save(fileToRestore);

    return {};
  }
}
