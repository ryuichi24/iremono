import { StorageItem } from '../../../entities';
import { makeStorageItemDTO } from '../../../models';
import { StorageItemRepository } from '../../../repositories';
import { InvalidRequestError } from '../../../shared/utils/errors';
import { isRootFolder } from '../../../shared/utils/is-rootr-folder';
import { IUploadFileUseCase, UploadFileRequestDTO, UploadFileResponseDTO } from './contracts';

export class UploadFileUseCase implements IUploadFileUseCase {
  constructor(private readonly _storageItemRepository: StorageItemRepository) {}

  public async handle(dto: UploadFileRequestDTO): Promise<UploadFileResponseDTO> {
    let parentFolder;

    if (isRootFolder(dto.parentId)) {
      parentFolder = await this._storageItemRepository.findRootFolderByOwnerId(dto.ownerId);
    }

    if (!isRootFolder(dto.parentId)) {
      parentFolder = await this._storageItemRepository.findOneById(dto.parentId);
    }

    if (!parentFolder || !parentFolder.isFolder) throw new InvalidRequestError('the parent folder does not exist.');

    if (parentFolder.ownerId !== dto.ownerId)
      throw new InvalidRequestError(`the owner does not match the folder's owner`);

    if (parentFolder.isInTrash) throw new InvalidRequestError('the parent folder is in a trash.');

    if (parentFolder.isCryptoFolderItem && !dto.isCryptoFolderItem)
      throw new InvalidRequestError(
        'the parent folder is crypto folder but the uploaded file is not encrypted with client key.',
      );

    const file = new StorageItem({
      name: dto.name,
      isFolder: false,
      ownerId: dto.ownerId,
      parentId: parentFolder.id,
      filePath: dto.filePath,
      fileSize: dto.fileSize,
      mimeType: dto.mimeType,
      initializationVector: dto.fileInitializationVector,
      thumbnailPath: dto.thumbnailPath,
      thumbnailSize: dto.thumbnailSize,
      thumbnailInitializationVector: dto.thumbnailInitializationVector,
      isCryptoFolderItem: dto.isCryptoFolderItem,
    });

    const saved = await this._storageItemRepository.save(file);

    return makeStorageItemDTO(saved);
  }
}
