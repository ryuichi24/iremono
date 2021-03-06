import { config } from '../config';
import {
  constructMockUserRepository,
  constructMockStorageItemRepository,
  MysqlUserRepository,
  MysqlStorageItemRepository,
  SqliteUserRepository,
  SqliteStorageItemRepository,
  DatabaseType,
} from '@iremono/backend-core/dist/infra/data-access';
import {
  AccessTokenService,
  constructBcryptService,
  constructCryptoService,
  DownloadFileTokenService,
  RefreshTokenTokenService,
  StreamFileTokenService,
} from '@iremono/backend-core/dist/infra/services';
import {
  CheckAuthUseCase,
  CreateFolderUseCase,
  CreateRootFolderUseCase,
  DeleteAllInTrashUseCase,
  DeleteFileInTrashUseCase,
  DeleteFolderInTrashUseCase,
  DownloadFileThumbnailUseCase,
  DownloadFileUseCase,
  GetFileTokenUseCase,
  GetFolderUseCase,
  ListAllAncestorsUseCase,
  ListItemsInFolderUseCase,
  ListItemsInTrashUseCase,
  RefreshTokenUseCase,
  RemoveFileUseCase,
  RemoveFolderUseCase,
  RestoreFileUseCase,
  RestoreFolderUseCase,
  SignInUseCase,
  SignOutUseCase,
  SignUpUseCase,
  StreamVideoUseCase,
  UpdateFileUseCase,
  UpdateFolderUseCase,
  UploadFileUseCase,
  VerifyClientEncryptionKeyUseCase,
} from '@iremono/backend-core/dist/use-cases';
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
  CheckAuthController,
  SignInController,
  SignUpController,
  DeleteFileInTrashController,
  DeleteFolderInTrashController,
  ListItemsInTrashController,
  DeleteAllInTrashController,
  DownloadFileThumbnailController,
  GetFolderController,
  ListAllAncestorsController,
  StreamVideoController,
  RefreshTokenController,
  GetFileTokenController,
  SignOutController,
  CreateRootFolderController,
  VerifyClientEncryptionKeyController,
} from '../controllers';
import { loggerFactory } from '../shared/utils/logger';
import { Cache } from '@iremono/util';

const repositories = {
  userRepository: [
    { dbType: DatabaseType.MYSQL, repository: new MysqlUserRepository(loggerFactory) },
    { dbType: DatabaseType.SQLITE, repository: new SqliteUserRepository(loggerFactory) },
  ],
  storageItemRepository: [
    { dbType: DatabaseType.MYSQL, repository: new MysqlStorageItemRepository(loggerFactory) },
    { dbType: DatabaseType.SQLITE, repository: new SqliteStorageItemRepository(loggerFactory) },
  ],
};

export const userRepository =
  repositories.userRepository.find((repo) => repo.dbType === config.dbConfig.DB_TYPE)?.repository ||
  constructMockUserRepository(loggerFactory);

const storageItemRepository =
  repositories.storageItemRepository.find((repo) => repo.dbType === config.dbConfig.DB_TYPE)?.repository ||
  constructMockStorageItemRepository(loggerFactory);

const bcryptService = constructBcryptService();

export const cryptoService = constructCryptoService();

export const accessTokenService = new AccessTokenService({
  secretKey: config.tokenConfig.JWT_SECRET_FOR_ACCESS_TOKEN,
  expiresIn: config.tokenConfig.JWT_EXPIRE_IN_FOR_ACCESS_TOKEN,
});

export const refreshTokenService = new RefreshTokenTokenService(new Cache(), {
  expiresIn: config.tokenConfig.EXPIRE_IN_FOR_REFRESH_TOKEN,
  tokenSize: 40,
});

export const downloadFileTokenService = new DownloadFileTokenService(new Cache(), {
  expiresIn: config.tokenConfig.EXPIRE_IN_FOR_DOWNLOAD_FILE_TOKEN,
  tokenSize: 40,
});

export const streamFileTokenService = new StreamFileTokenService(new Cache(), {
  expiresIn: config.tokenConfig.EXPIRE_IN_FOR_STREAM_FILE_TOKEN,
  tokenSize: 40,
});

// User
const signUpUseCase = new SignUpUseCase(
  userRepository,
  accessTokenService,
  refreshTokenService,
  bcryptService,
  new CreateRootFolderUseCase(storageItemRepository, bcryptService),
);
const signInUseCase = new SignInUseCase(userRepository, accessTokenService, refreshTokenService, bcryptService);
const signOutUseCase = new SignOutUseCase(refreshTokenService);
const checkAuthUseCase = new CheckAuthUseCase(userRepository);
const refreshTokenUseCase = new RefreshTokenUseCase(accessTokenService, refreshTokenService);

export const signUpController = new SignUpController(signUpUseCase);
export const signInController = new SignInController(signInUseCase);
export const signOutController = new SignOutController(signOutUseCase);
export const checkAuthController = new CheckAuthController(checkAuthUseCase);
export const refreshTokenController = new RefreshTokenController(refreshTokenUseCase);

// folders
const createFolderUseCase = new CreateFolderUseCase(storageItemRepository);
const createRootFolderUseCase = new CreateRootFolderUseCase(storageItemRepository, bcryptService);
const verifyClientEncryptionKeyUseCase = new VerifyClientEncryptionKeyUseCase(storageItemRepository, bcryptService);
const updateFolderUseCase = new UpdateFolderUseCase(storageItemRepository);
const removeFolderUseCase = new RemoveFolderUseCase(storageItemRepository);
const restoreFolderUseCase = new RestoreFolderUseCase(storageItemRepository);
const listItemsInFolderUserCase = new ListItemsInFolderUseCase(storageItemRepository);
const getFolderUserCase = new GetFolderUseCase(storageItemRepository);
const listAllAncestorsUserCase = new ListAllAncestorsUseCase(storageItemRepository);

export const createFolderController = new CreateFolderController(createFolderUseCase);
export const createRootFolderController = new CreateRootFolderController(createRootFolderUseCase);
export const verifyClientEncryptionKeyController = new VerifyClientEncryptionKeyController(
  verifyClientEncryptionKeyUseCase,
);
export const updateFolderController = new UpdateFolderController(updateFolderUseCase);
export const removeFolderController = new RemoveFolderController(removeFolderUseCase);
export const restoreFolderController = new RestoreFolderController(restoreFolderUseCase);
export const listItemsInFolderController = new ListItemsInFolderController(listItemsInFolderUserCase);
export const getFolderController = new GetFolderController(getFolderUserCase);
export const listAllAncestorsController = new ListAllAncestorsController(listAllAncestorsUserCase);

// files
const uploadFileUseCase = new UploadFileUseCase(storageItemRepository);
const downloadFileUseCase = new DownloadFileUseCase(storageItemRepository, downloadFileTokenService);
const getFileTokenUseCase = new GetFileTokenUseCase(
  storageItemRepository,
  downloadFileTokenService,
  streamFileTokenService,
);
const downloadFileThumbnailUseCase = new DownloadFileThumbnailUseCase(storageItemRepository);
const updateFileUseCase = new UpdateFileUseCase(storageItemRepository);
const removeFileUseCase = new RemoveFileUseCase(storageItemRepository);
const restoreFileUseCase = new RestoreFileUseCase(storageItemRepository);
const streamVideoUseCase = new StreamVideoUseCase(storageItemRepository, streamFileTokenService);

export const uploadFileController = new UploadFileController(uploadFileUseCase);
export const downloadFileController = new DownloadFileController(downloadFileUseCase, cryptoService);
export const getFileTokenController = new GetFileTokenController(getFileTokenUseCase);
export const downloadFileThumbnailController = new DownloadFileThumbnailController(
  downloadFileThumbnailUseCase,
  cryptoService,
);
export const updateFileController = new UpdateFileController(updateFileUseCase);
export const removeFileController = new RemoveFileController(removeFileUseCase);
export const restoreFileController = new RestoreFileController(restoreFileUseCase);
export const streamVideoController = new StreamVideoController(streamVideoUseCase, cryptoService);

// trash
const deleteFileInTrashUseCase = new DeleteFileInTrashUseCase(storageItemRepository);
const deleteFolderInTrashUseCase = new DeleteFolderInTrashUseCase(storageItemRepository);
const listItemsInTrashUseCase = new ListItemsInTrashUseCase(storageItemRepository);
const deleteAllInTrashUseCase = new DeleteAllInTrashUseCase(storageItemRepository);

export const deleteFileInTrashController = new DeleteFileInTrashController(deleteFileInTrashUseCase);
export const deleteFolderInTrashController = new DeleteFolderInTrashController(deleteFolderInTrashUseCase);
export const listItemsInTrashController = new ListItemsInTrashController(listItemsInTrashUseCase);
export const deleteAllInTrashController = new DeleteAllInTrashController(deleteAllInTrashUseCase);
