import { StorageItemRepository } from '../../../repositories';
import { InvalidRequestError } from '../../../shared/utils/errors';
import { IRestoreFolderUseCase, RestoreFolderRequestDTO, RestoreFolderResponseDTO } from './contracts';

export class RestoreFolderUseCase implements IRestoreFolderUseCase {
  constructor(private readonly _storageItemRepository: StorageItemRepository) {}

  public async handle(dto: RestoreFolderRequestDTO): Promise<RestoreFolderResponseDTO> {
    const folderToRestore = await this._storageItemRepository.findOneById(dto.id);

    if (!folderToRestore || !folderToRestore.isFolder) throw new InvalidRequestError('the folder does not exist.');

    const parentFolder = await this._storageItemRepository.findOneById(folderToRestore.parentId!);
    if (parentFolder?.isInTrash) throw new InvalidRequestError('the parent folder is in a trash.');

    if (folderToRestore.ownerId !== dto.ownerId)
      throw new InvalidRequestError(`the owner does not match the folder's owner`);

    const allDescendants = await this._storageItemRepository.findAllDescendantsById(folderToRestore.id, true);

    await Promise.all(
      allDescendants.map(async (descendant) => {
        descendant.restore();
        await this._storageItemRepository.save(descendant);
      }),
    );

    folderToRestore.restore();
    await this._storageItemRepository.save(folderToRestore);

    return {};
  }
}
