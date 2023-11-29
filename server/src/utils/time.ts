export async function getTimeStamp(): Promise<string> {
  await wait(1);
  return Date.now().toString(36);
}

export async function wait(ms: number): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, ms));
}