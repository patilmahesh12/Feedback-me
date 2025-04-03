declare namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string;
      JWT_SECRET: string;
      NODE_ENV: 'development' | 'production';
    }
  }