import { BaseHandler } from './BaseHandler';

export class UppercaseValidator extends BaseHandler {
  handle(request: string): string | null {
    if (!/[A-Z]/.test(request)) {
      return 'The password does not contain an uppercase letter';
    }
    return super.handle(request);
  }
}
