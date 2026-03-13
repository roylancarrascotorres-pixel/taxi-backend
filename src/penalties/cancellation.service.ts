export function applyCancelPenalty(
  walletClient: any,
  walletDriver: any,
  cancelBy: 'client' | 'driver'
) {
  const penalty = Number(process.env.CANCEL_PENALTY || 0.5);
  if(cancelBy === 'client') {
    walletClient.balance -= penalty;
    walletDriver.balance += penalty;
  }
}