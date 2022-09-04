import { EventConsumerHandler } from '@lambda/core/iface'
import { MessageEventDTO } from '@lambda/core/events'
import { MessageValidator } from './Validator'

export const createHandler = (): EventConsumerHandler<MessageEventDTO> =>
  async (data: MessageEventDTO) => {
    const errors = MessageValidator(data)

    if (Array.isArray(errors) && errors.length) {
      // todo log errors

      return
    }

    console.log(data)
  }
