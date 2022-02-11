import { RemoveFileRequestDTO } from '@iremono/backend-core/src/use-cases/files/remove-file';
import { HttpRequest } from '../../../shared/controller-lib';

export const makeRemoveFileRequestDTO = ({ params: { id }, user }: HttpRequest): RemoveFileRequestDTO => ({
  id,
  ownerId: user.id,
});