import { Developer } from './Developer';
import { Manager } from './Manager';
import { Robot } from './Robot';

const dev = new Developer();
dev.work();
dev.code();
dev.reportProgress();
dev.takeBreak();
dev.payTax();

const mgr = new Manager();
mgr.work();
mgr.reportProgress();
mgr.takeBreak();
mgr.payTax();

const robot = new Robot();
robot.work();
