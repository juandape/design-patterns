interface IEmployee{
  work(): void,
  manage(): void,
  code(): void,
  reportProgress(): string,
  takeBreak(): void
  payTax(): void
}

export class Developer implements IEmployee {
  work(): void {
    console.log("Developer is working");
  }
  manage(): void {
    console.log("Developer can't manage");
  }
  code(): void{
    console.log("Developer is coding");
  }
  reportProgress(): string {
    console.log("Developer is reporting progress");
    return "Progress reported";
  }
  takeBreak(): void {
    console.log("Developer is taking a break");
  }
  payTax(): void {
    console.log("Developer is paying taxes");
  }
}

export class Manager implements IEmployee {
  work(): void {
    console.log("Manager is working");
  }
  manage(): void {
    console.log("Manager is managing");
  }
  code(): void{
    console.log("Manager can't code");
  }
  reportProgress(): string {
    console.log("Manager is reporting progress");
    return "Progress reported";
  }
  takeBreak(): void {
    console.log("Manager is taking a break");
  }
  payTax(): void {
    console.log("Manager is paying taxes");
  }
}

export class Robot implements IEmployee{
  work(): void {
    console.log("Robot is working");
  }
  manage(): void {
    console.log("Robot can't manage");
  }
  code(): void{
    console.log("Robot can't code");
  }
  reportProgress(): string {
    console.log("Robot can't report progress");
    return "Progress reported";
  }
  takeBreak(): void {
    console.log("Robot can't take a break");
  }
  payTax(): void {
    console.log("Robot can't pay taxes");
  }
}