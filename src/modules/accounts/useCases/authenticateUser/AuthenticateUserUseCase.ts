import { compare } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { inject, injectable } from 'tsyringe'

import { AppError } from '../../../../shared/errors/AppError'
import { IUsersRepository } from '../../repositories/IUsersRepository'

interface IRequest {
  email: string
  password: string
}

interface IResponse {
  user: {
    name: string,
    email: string
  },
  token: string
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) { }
  
  async execute({ email, password }: IRequest): Promise<IResponse> {
    // Verificar se usuário existe
    const user = await this.usersRepository.findByEmail(email)
    if (!user) {
      throw new AppError('Email or password incorrect!')      
    }

    // Verificar se senha está correta
    const passwordMatch = await compare(password, user.password)
    if (!passwordMatch) {
      throw new AppError('Email or password incorrect!');      
    }

    // Gerar jsonwebtoken
    const token = sign({}, 'b4067062d329e0657e38c3f7e90cb20c', {
      subject: user.id,
      expiresIn: '1d'
    })

    const tokenReturn: IResponse = {
      token,
      user: {
        name: user.name,
        email: user.email
      }
    }

    return tokenReturn

  }
}

export { AuthenticateUserUseCase }
