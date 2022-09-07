import { NextFunction, Request, Response } from 'express'
import { IServiceCradle } from '../iface'

export const createErrorHandler = ({ logger }: IServiceCradle) =>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (error: Error, req: Request, res: Response, _: NextFunction) => {
    logger.error(error.message)

    res.status(500).send(error.message)
  }
