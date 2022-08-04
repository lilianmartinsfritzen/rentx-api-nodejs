import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { UsersRepository } from '../modules/accounts/repositories/implementations/UsersRepository';

interface IPayload {
  sub: string
}

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {

  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw new Error('Token missing')    
  }

  const [, token] = authHeader.split(' ')

  try {
    const { sub: user_id } = verify(token, 'b4067062d329e0657e38c3f7e90cb20c') as IPayload
    
    const usersRepository = new UsersRepository()

    const user = usersRepository.findById(user_id)

    if (!user) {
      throw new Error('User does not exists!')      
    }

    next()
  } catch (error) {
    throw new Error('Invalid token!')
  }
  
}
