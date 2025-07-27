import { type StorageProvider } from "./types";
import { S3StorageProvider, type S3StorageConfig } from "./providers/s3";
import { ConsoleStorageProvider, type ConsoleStorageConfig } from "./providers/console";

export * from "./types";

type StorageConfig = 
  | { provider: "s3"; config: S3StorageConfig }
  | { provider: "console"; config?: ConsoleStorageConfig }
  | { provider: "custom"; instance: StorageProvider };

class StorageService {
  private provider: StorageProvider;

  constructor(config: StorageConfig) {
    switch (config.provider) {
      case "s3":
        this.provider = new S3StorageProvider(config.config);
        break;
      case "console":
        this.provider = new ConsoleStorageProvider(config.config);
        break;
      case "custom":
        this.provider = config.instance;
        break;
      default:
        throw new Error(`Unknown storage provider: ${(config as { provider: string }).provider}`);
    }
  }

  getProvider(): StorageProvider {
    return this.provider;
  }
}

// Initialize storage based on environment
function createStorage(): StorageService {
  const provider = process.env.STORAGE_PROVIDER ?? "console";

  switch (provider) {
    case "s3":
      return new StorageService({
        provider: "s3",
        config: {
          bucket: process.env.AWS_S3_BUCKET!,
          region: process.env.AWS_REGION,
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          publicBaseUrl: process.env.AWS_S3_PUBLIC_URL,
        },
      });
    
    case "console":
    default:
      return new StorageService({
        provider: "console",
        config: {
          uploadDir: process.env.UPLOAD_DIR,
          baseUrl: process.env.UPLOAD_BASE_URL,
        },
      });
  }
}

// Export singleton instance
export const storage = createStorage().getProvider();

// Export for custom configurations
export { StorageService, S3StorageProvider, ConsoleStorageProvider };