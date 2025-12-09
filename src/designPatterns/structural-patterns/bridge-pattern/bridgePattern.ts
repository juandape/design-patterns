import { Email } from './channels/email';
import { Push } from './channels/push';
import { SMS } from './channels/sms';
import { AlertNotifier } from './notifiers/alertNotifier';
import { BasicNotifier } from "./notifiers/basicNotifier"
import { SystemNotifier } from './notifiers/systemNotifier';

export const bridgePattern = () => {
  const emailBasic = new BasicNotifier(new Email())
  emailBasic.notify("Hello via Email")

  const smsAlert = new AlertNotifier(new SMS())
  smsAlert.notify("Hello via SMS")

  const pushSystem = new SystemNotifier(new Push())
  pushSystem.notify("Hello via Push")

  const emailAlert = new AlertNotifier(new Email())
  emailAlert.notify("Hello via Email")
}

bridgePattern()