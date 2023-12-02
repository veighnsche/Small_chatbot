export async function getTimeStamp(): Promise<string> {
  // random number between 1 and 26
  const randomNumber = Math.floor(Math.random() * 26) + 1;
  await wait(randomNumber);
  return Date.now().toString(36);
}

export async function wait(ms: number): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, ms));
}