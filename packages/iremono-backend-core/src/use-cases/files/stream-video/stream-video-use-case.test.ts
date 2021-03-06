import crypto from 'crypto';
import { jest } from '@jest/globals';
import { StorageItem } from '../../../entities';
import { constructMockStorageItemRepository } from '../../../infra/data-access/mock/repositories/mock-storage-item-repository';
import { FileTokenOutput, IStreamFileTokenService, TokenOutput } from '../../../services';
import { StreamVideoRequestDTO } from './contracts';
import { StreamVideoUseCase } from './stream-video-use-case';

const TEST_USER_1_ID = crypto.randomUUID();
const TEST_ROOT_FOLDER_1_ID = crypto.randomUUID();
const TEST_FOLDER_1_ID = crypto.randomUUID();
const TEST_FILE_1_ID = crypto.randomUUID();

const mockItems = [
  new StorageItem(
    { name: 'test root folder', isFolder: true, ownerId: TEST_USER_1_ID, parentId: null, isRootFolder: true },
    TEST_ROOT_FOLDER_1_ID,
  ),
  new StorageItem(
    {
      name: 'test folder 1',
      isFolder: true,
      ownerId: TEST_USER_1_ID,
      parentId: TEST_ROOT_FOLDER_1_ID,
    },
    TEST_FOLDER_1_ID,
  ),
  new StorageItem(
    {
      name: 'test file 1',
      isFolder: false,
      ownerId: TEST_USER_1_ID,
      parentId: TEST_FOLDER_1_ID,
      mimeType: 'test mime type',
      filePath: 'test file path',
      fileSize: 9999,
      initializationVector: 'test initialization vector',
    },
    TEST_FILE_1_ID,
  ),
];

const mockStorageItemRepository = constructMockStorageItemRepository();

beforeEach(async () => {
  for (const item of mockItems) {
    await mockStorageItemRepository.save(item);
  }
});

afterEach(async () => {
  for (const item of mockItems) {
    await mockStorageItemRepository.remove(item);
  }
});

describe('test StreamVideoUseCase handle method', () => {
  it('should return a video file item to stream', async () => {
    const STREAM_FILE_TOKEN = '8841d0eb5b8c7c089e7db15fd59e80c3';

    const mockStreamVideoTokenService: IStreamFileTokenService = {
      generate: jest.fn((payload: FileTokenOutput): TokenOutput => {
        return {
          expiresIn: '',
          value: '',
        };
      }),
      verify: jest.fn((token: string): FileTokenOutput => {
        return {
          fileId: TEST_FILE_1_ID,
          clientEncryptionKey: '',
        };
      }),
    };

    const streamVideoUseCase = new StreamVideoUseCase(mockStorageItemRepository, mockStreamVideoTokenService);

    const mockStreamVideoUseCaseDTO: StreamVideoRequestDTO = {
      id: TEST_FILE_1_ID,
      streamFileToken: STREAM_FILE_TOKEN,
    };

    const responseDTO = await streamVideoUseCase.handle(mockStreamVideoUseCaseDTO);

    expect(responseDTO.name).toBeTruthy();
    expect(responseDTO.mimeType).toBeTruthy();
    expect(responseDTO.filePath).toBeTruthy();
    expect(responseDTO.fileSize).toBeTruthy();
    expect(responseDTO.fileInitializationVector).toBeTruthy();
  });
});
