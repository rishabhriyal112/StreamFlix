// Rate limit friendly request queue
class RequestQueue {
  constructor(maxConcurrent = 3, delay = 250) {
    this.queue = [];
    this.running = 0;
    this.maxConcurrent = maxConcurrent;
    this.delay = delay;
  }

  async add(requestFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ requestFn, resolve, reject });
      this.process();
    });
  }

  async process() {
    if (this.running >= this.maxConcurrent || this.queue.length === 0) return;
    
    this.running++;
    const { requestFn, resolve, reject } = this.queue.shift();
    
    try {
      const result = await requestFn();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.running--;
      setTimeout(() => this.process(), this.delay);
    }
  }
}

export const apiQueue = new RequestQueue();