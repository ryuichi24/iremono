import { makeStorageItemDTO } from '../../../models';
import { StorageItemRepository } from '../../../repositories';
import { NotExistError } from '../../../shared/utils/errors';
import { DeleteAllInTrashRequestDTO, DeleteAllInTrashResponseDTO, IDeleteAllInTrashUseCase } from './contracts';

export class DeleteAllInTrashUseCase implements IDeleteAllInTrashUseCase {
  constructor(private readonly _storageItemRepository: StorageItemRepository) {}

  public async handle(dto: DeleteAllInTrashRequestDTO): Promise<DeleteAllInTrashResponseDTO> {
    const rootFolder = await this._storageItemRepository.findRootFolderByOwnerId(dto.ownerId);
    if (!rootFolder) throw new NotExistError('The root folder does not exists.');

    const trashItems = await this._storageItemRepository.findAllDescendantsById(rootFolder.id, true);
    await Promise.all(trashItems.map(async (trashItem) => await this._storageItemRepository.remove(trashItem)));

    return {
      deletedFiles: trashItems
        .filter((trashItem) => !trashItem.isFolder)
        .map((trashItem) => makeStorageItemDTO(trashItem)),
    };
  }
}
