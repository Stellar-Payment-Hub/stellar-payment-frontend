export interface QueuedOfflineTx {
  id: string;
  recipient: string;
  amount: number;
  token: string;
  queuedAt: number;
}

export class OfflineTxCache {
  private static KEY = 'stellar_hub_offline_queue';

  static getQueue(): QueuedOfflineTx[] {
    try {
      const data = localStorage.getItem(this.KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static enqueue(tx: Omit<QueuedOfflineTx, 'id' | 'queuedAt'>): QueuedOfflineTx {
    const queue = this.getQueue();
    const item: QueuedOfflineTx = { ...tx, id: `offline-${Date.now()}`, queuedAt: Date.now() };
    queue.push(item);
    try {
      localStorage.setItem(this.KEY, JSON.stringify(queue));
    } catch {}
    return item;
  }

  static clearQueue(): void {
    try {
      localStorage.removeItem(this.KEY);
    } catch {}
  }
}
