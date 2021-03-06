import { StorageItem } from '../../../entities';
import { makeStorageItemDTO } from '../../../models';
import { StorageItemRepository } from '../../../repositories';
import { HashService } from '../../../services';
import { InvalidRequestError } from '../../../shared/utils/errors';
import { CreateRootFolderRequestDTO, CreateRootFolderResponseDTO, ICreateRootFolderUseCase } from './contracts';

export class CreateRootFolderUseCase implements ICreateRootFolderUseCase {
  constructor(
    private readonly _storageItemRepository: StorageItemRepository,
    private readonly _hashService: HashService,
  ) {}

  public async handle(dto: CreateRootFolderRequestDTO): Promise<CreateRootFolderResponseDTO> {
    const alreadyExists =
      dto.folderType === 'crypto'
        ? !!(await this._storageItemRepository.findCryptoRootFolderByOwnerId(dto.ownerId))
        : !!(await this._storageItemRepository.findRootFolderByOwnerId(dto.ownerId));

    if (alreadyExists) throw new InvalidRequestError('root folder for the user already exists.');

    const folder = new StorageItem({
      name: dto.name || 'all files',
      isFolder: true,
      ownerId: dto.ownerId,
      parentId: null,
      isRootFolder: true,
      isCryptoFolderItem: dto.folderType === 'crypto',
      clientEncryptionKey: dto.clientEncryptionKey,
    });

    if (dto.folderType === 'crypto') await folder.hashClientEncryptionKey(this._hashService.hash);

    const saved = await this._storageItemRepository.save(folder);

    return makeStorageItemDTO(saved);
  }
}
