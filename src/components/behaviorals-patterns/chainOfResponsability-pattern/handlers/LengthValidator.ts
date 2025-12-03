import { BaseHandler } from './BaseHandler';

export class LengthValidator extends BaseHandler {
  handle(request: string): string | null {
    if (request.length < 8) {
      return 'Password length is less than 8';
    }
    return super.handle(request);
  }
}
