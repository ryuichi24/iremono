import { User } from '../../../entities';
import { makeUserDTO } from '../../../models';
import { UserRepository, StorageItemRepository } from '../../../repositories';
import { HashService, TokenService } from '../../../services';
import { InvalidRequestError } from '../../../shared/utils/errors';
import { CreateRootFolderUseCase } from '../../folders';
import { ISignUpUseCase } from './i-sign-up-use-case';
import { SignUpRequestDTO } from './sign-up-request-DTO';
import { SignUpResponseDTO } from './sign-up-response-DTO';

export class SignUpUseCase implements ISignUpUseCase {
  private readonly _userRepository: UserRepository;
  private readonly _tokenService: TokenService;
  private readonly _hashService: HashService;
  private readonly _createRootFolderUseCase: CreateRootFolderUseCase;

  constructor(
    userRepository: UserRepository,
    tokenService: TokenService,
    hashService: HashService,
    createRootFolderUseCase: CreateRootFolderUseCase,
  ) {
    this._userRepository = userRepository;
    this._tokenService = tokenService;
    this._hashService = hashService;
    this._createRootFolderUseCase = createRootFolderUseCase;
  }

  public async handle(dto: SignUpRequestDTO): Promise<SignUpResponseDTO> {
    const isDuplicate = !!(await this._userRepository.findOneByEmail(dto.email));
    if (isDuplicate) throw new InvalidRequestError('the email is already registered');

    const user = new User({ email: dto.email, password: dto.password });
    await user.hashPassword(this._hashService.hash);
    const savedUser = await this._userRepository.save(user);

    // TODO: decouple root folder initialization with event emitter
    await this._createRootFolderUseCase.handle({ name: 'all files', ownerId: savedUser.id, folderType: 'normal' });

    const accessToken = this._tokenService.generateAccessToken({ id: savedUser.id });
    const refreshToken = this._tokenService.generateRefreshToken(savedUser.id);

    return {
      accessToken,
      refreshToken,
      user: makeUserDTO(savedUser),
    };
  }
}
