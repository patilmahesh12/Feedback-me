export function getRequiredEnvVar(name: keyof NodeJS.ProcessEnv): string {
    const value = process.env[name];
    if (!value) {
      throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
  }