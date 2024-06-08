export const computed = async (nodes: any, func: any) => {
  const results = await Promise.all(nodes);
  return func(...results);
};

export class Logger {
  public verbose: boolean;
  public startTime: number;
  public logs: Array<Record<string, any>> = [];
  constructor(options: Record<string, any>) {
    this.verbose = options.verbose ?? false;
    this.startTime = Date.now();
  }

  public async computed(nodes: any, func: any, options: Record<string, any> = { name: 'no name' }) {
    const results = await Promise.all(nodes);
    const startTime = Date.now();
    const logStart = {
      name: options.name,
      time: Date.now(),
      state: "started",
    };
    this.logs.push(logStart);
    if (this.verbose) {
      console.log(`starting: ${logStart.name} at ${logStart.time - this.startTime}`)
    }
    const result = await func(...results);
    const logEnd = {
      name: options.name,
      time: Date.now(),
      state: "completed",
    };
    this.logs.push(logEnd);
    if (this.verbose) {
      console.log(`complted: ${logEnd.name} at ${logEnd.time - this.startTime}, duration:${logEnd.time - startTime}ms`)
    }
    return result;
  }
}
