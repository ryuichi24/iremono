import { config } from '../config';
import {
  constructMockIdentityRepository,
  constructMockStorageItemRepository,
} from '@iremono/backend-core/src/infra/data-access';
import {
  constructBcryptService,
  constructCryptoService,
  constructJwtService,
} from '@iremono/backend-core/src/infra/services';
import {
  CheckIdentityUseCase,
  CreateFolderUseCase,
  DeleteFileInTrashUseCase,
  DeleteFolderInTrashUseCase,
  DownloadFileUseCase,
  ListItemsInFolderUseCase,
  RemoveFileUseCase,
  RemoveFolderUseCase,
  RestoreFileUseCase,
  RestoreFolderUseCase,
  SignInUseCase,
  SignUpUseCase,
  UpdateFileUseCase,
  UpdateFolderUseCase,
  UploadFileUseCase,
} from '@iremono/backend-core/src/use-cases';
import {
  CreateFolderController,
  ListItemsInFolderController,
  RemoveFolderController,
  RestoreFolderController,
  UpdateFolderController,
  RemoveFileController,
  RestoreFileController,
  UpdateFileController,
  UploadFileController,
  DownloadFileController,
  CheckIdentityController,
  SignInController,
  SignUpController,
  DeleteFileInTrashController,
  DeleteFolderInTrashController,
} from '../controllers';
import { loggerFactory } from '../shared/utils/logger';

// TODO: replace it once the real repository gets ready
const identityRepository = constructMockIdentityRepository(loggerFactory);
const storageItemRepository = constructMockStorageItemRepository(loggerFactory);

const bcryptService = constructBcryptService();
export const jwtService = constructJwtService({
  jwtSecret: config.jwtConfig.JWT_SECRET,
  jwtExpiresIn: config.jwtConfig.JWT_EXPIRE_IN,
});
export const cryptoService = constructCryptoService();

// identity
const signUpUseCase = new SignUpUseCase(identityRepository, storageItemRepository, jwtService, bcryptService);
const signInUseCase = new SignInUseCase(identityRepository, jwtService, bcryptService);
const checkIdentityUseCase = new CheckIdentityUseCase(identityRepository);

export const signUpController = new SignUpController(signUpUseCase, loggerFactory);
export const signInController = new SignInController(signInUseCase, loggerFactory);
export const checkIdentityController = new CheckIdentityController(checkIdentityUseCase, loggerFactory);

// folders
const createFolderUseCase = new CreateFolderUseCase(storageItemRepository);
const updateFolderUseCase = new UpdateFolderUseCase(storageItemRepository);
const removeFolderUseCase = new RemoveFolderUseCase(storageItemRepository);
const restoreFolderUseCase = new RestoreFolderUseCase(storageItemRepository);
const listItemsInFolderUserCase = new ListItemsInFolderUseCase(storageItemRepository);

export const createFolderController = new CreateFolderController(createFolderUseCase, loggerFactory);
export const updateFolderController = new UpdateFolderController(updateFolderUseCase, loggerFactory);
export const removeFolderController = new RemoveFolderController(removeFolderUseCase, loggerFactory);
export const restoreFolderController = new RestoreFolderController(restoreFolderUseCase, loggerFactory);
export const listItemsInFolderController = new ListItemsInFolderController(listItemsInFolderUserCase, loggerFactory);

// files
const uploadFileUseCase = new UploadFileUseCase(storageItemRepository);
const downloadFileUseCase = new DownloadFileUseCase(storageItemRepository);
const updateFileUseCase = new UpdateFileUseCase(storageItemRepository);
const removeFileUseCase = new RemoveFileUseCase(storageItemRepository);
const restoreFileUseCase = new RestoreFileUseCase(storageItemRepository);

export const uploadFileController = new UploadFileController(uploadFileUseCase, loggerFactory);
export const downloadFileController = new DownloadFileController(downloadFileUseCase, cryptoService, loggerFactory);
export const updateFileController = new UpdateFileController(updateFileUseCase, loggerFactory);
export const removeFileController = new RemoveFileController(removeFileUseCase, loggerFactory);
export const restoreFileController = new RestoreFileController(restoreFileUseCase, loggerFactory);

// trash
const deleteFileInTrashUseCase = new DeleteFileInTrashUseCase(storageItemRepository);
const deleteFolderInTrashUseCase = new DeleteFolderInTrashUseCase(storageItemRepository);

export const deleteFileInTrashController = new DeleteFileInTrashController(deleteFileInTrashUseCase, loggerFactory);
export const deleteFolderInTrashController = new DeleteFolderInTrashController(
  deleteFolderInTrashUseCase,
  loggerFactory,
);
