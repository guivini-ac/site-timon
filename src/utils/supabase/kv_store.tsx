export interface KVRecord {
  key: string;
  value: any;
  created_at?: string;
  updated_at?: string;
}

// Simple mock implementation for client-side use
// In production, this would communicate with the server through API calls
class KVClient {
  private mockStorage: Map<string, any> = new Map();

  // Get single value
  async get(key: string): Promise<any> {
    try {
      // For demo purposes, use localStorage as fallback
      const stored = localStorage.getItem(`kv:${key}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error(`KV get error for key ${key}:`, error);
      return null;
    }
  }

  // Set single value
  async set(key: string, value: any): Promise<void> {
    try {
      // For demo purposes, use localStorage as fallback
      localStorage.setItem(`kv:${key}`, JSON.stringify(value));
      console.log(`KV set: ${key} =`, value);
    } catch (error) {
      console.error(`KV set error for key ${key}:`, error);
      throw error;
    }
  }

  // Delete single value
  async del(key: string): Promise<void> {
    try {
      localStorage.removeItem(`kv:${key}`);
      console.log(`KV del: ${key}`);
    } catch (error) {
      console.error(`KV del error for key ${key}:`, error);
      throw error;
    }
  }

  // Get multiple values
  async mget(keys: string[]): Promise<any[]> {
    try {
      if (keys.length === 0) return [];
      
      return keys.map(key => {
        const stored = localStorage.getItem(`kv:${key}`);
        return stored ? JSON.parse(stored) : null;
      });
    } catch (error) {
      console.error(`KV mget error for keys ${keys.join(', ')}:`, error);
      return new Array(keys.length).fill(null);
    }
  }

  // Set multiple values
  async mset(entries: Record<string, any>): Promise<void> {
    try {
      Object.entries(entries).forEach(([key, value]) => {
        localStorage.setItem(`kv:${key}`, JSON.stringify(value));
      });
      console.log('KV mset:', entries);
    } catch (error) {
      console.error('KV mset error:', error);
      throw error;
    }
  }

  // Delete multiple values
  async mdel(keys: string[]): Promise<void> {
    try {
      if (keys.length === 0) return;
      
      keys.forEach(key => {
        localStorage.removeItem(`kv:${key}`);
      });
      console.log('KV mdel:', keys);
    } catch (error) {
      console.error(`KV mdel error for keys ${keys.join(', ')}:`, error);
      throw error;
    }
  }

  // Get values by prefix
  async getByPrefix(prefix: string): Promise<any[]> {
    try {
      const results = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`kv:${prefix}`)) {
          const stored = localStorage.getItem(key);
          if (stored) {
            results.push(JSON.parse(stored));
          }
        }
      }
      return results;
    } catch (error) {
      console.error(`KV getByPrefix error for prefix ${prefix}:`, error);
      return [];
    }
  }

  // Helper function to get keys by prefix (useful for admin operations)
  async getKeysByPrefix(prefix: string): Promise<KVRecord[]> {
    try {
      const results = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`kv:${prefix}`)) {
          const stored = localStorage.getItem(key);
          if (stored) {
            const actualKey = key.replace('kv:', '');
            results.push({
              key: actualKey,
              value: JSON.parse(stored),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          }
        }
      }
      return results;
    } catch (error) {
      console.error(`KV getKeysByPrefix error for prefix ${prefix}:`, error);
      return [];
    }
  }
}

// Export the client instance
export const kvClient = new KVClient();

// Export individual functions for backward compatibility
export const {
  get,
  set,
  del,
  mget, 
  mset,
  mdel,
  getByPrefix,
  getKeysByPrefix
} = kvClient;