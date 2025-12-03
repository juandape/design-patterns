import { BaseHandler } from './BaseHandler';

export class NumberValidator extends BaseHandler {
  handle(request: string): string | null {
    if (!/\d/.test(request)) {
      return 'The password does not contain any numbers.';
    }
    return super.handle(request);
  }
}
