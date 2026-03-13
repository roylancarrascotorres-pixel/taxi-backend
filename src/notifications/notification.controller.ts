import { Controller, Post, Body } from '@nestjs/common'
import { NotificationService } from './notification.service'

@Controller('notifications')
export class NotificationController {

  constructor(
    private notificationService: NotificationService
  ) {}

  @Post('register-token')
  async registerToken(@Body() body: { userId:number, token:string }) {

    await this.notificationService.registerToken(body.userId, body.token)

    return { message:'Token registrado' }
  }

}