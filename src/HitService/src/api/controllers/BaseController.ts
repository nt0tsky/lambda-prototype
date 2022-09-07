import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary, Query, Send } from 'express-serve-static-core'

export interface TRequestBody<TBody> extends Request {
  body: TBody
  clientIp?: string
}

export interface TRequestQuery<TQuery extends Query = Record<string, string>> extends Request {
  query: TQuery
}

export interface TRequestParams<TParams extends ParamsDictionary> extends Request {
  params: TParams
}

export interface TRequest
<
  TQuery extends Query = Record<string, string>,
  TBody = unknown,
  TParams extends ParamsDictionary = Record<string, string>
  > extends Request {
  query: TQuery
  body: TBody
  params: TParams
}

export interface TResponse<TJSONBody> extends Response {
  json: Send<TJSONBody, this>
}

export abstract class BaseController {
  protected wrap = async <T extends Response>(fn: () => Promise<T>, next: NextFunction): Promise<T> => {
    let value: T

    try {
      value = await fn()
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return next(err)
    }

    return value
  }
}
