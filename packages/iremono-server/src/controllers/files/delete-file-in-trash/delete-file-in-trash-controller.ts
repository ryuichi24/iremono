import { DeleteFileInTrashUseCase } from '@iremono/backend-core/src/use-cases';
import { Logger, LoggerFactory } from '@iremono/util/src/logger';
import { deleteFromFileSystem } from '@iremono/util/src/file-system';
import { Controller, HttpRequest, HttpResponse } from '../../../shared/controller-lib';
import { makeDeleteFileInTrashRequestDTO } from './make-delete-file-in-trash-request-DTO';

export class DeleteFileInTrashController extends Controller<DeleteFileInTrashUseCase> {
  private readonly _logger: Logger;

  constructor(useCase: DeleteFileInTrashUseCase, loggerFactory: LoggerFactory) {
    super(useCase);
    this._logger = loggerFactory.createLogger(this.constructor.name);
  }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const dto = makeDeleteFileInTrashRequestDTO(request);
    const result = await this._useCase.handle(dto);

    await deleteFromFileSystem(result.deletedFile.filePath!);

    this._logger.info(
      'user has deleted a folder in trash',
      `[path="${request.fullPath}", method="${request.method}", host="${request.host}", ip="${request.ip}", message="user has deleted a folder in trash"]`,
    );

    return this._noContent();
  }
}
