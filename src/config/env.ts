export class Env {
  public static getEnv(): string | undefined {
    return process.env.APP_ENV;
  }

  public static get isDev(): boolean {
    return this.getEnv() === 'dev';
  }

  public static get isProd(): boolean {
    return !Env.isDev;
  }
  public static get BrevoApi(): string {
    return process.env.BREVO_TOKEN;
  }

  static get RedisHost(): string {
    return process.env.REDIS_HOST || 'localhost';
  }

  static get RedisPort(): number {
    return parseInt(process.env.REDIS_PORT || '6379');
  }

  static get JWTSecret(): string {
    return process.env.JWT_SECRET;
  }

  static get AlgoliaKey(): string {
    return process.env.ALGOLIA_KEY;
  }

  static get AlgoliaApplicationID(): string {
    return process.env.ALGOLIA_APPLICATION_ID;
  }

  static get DatabaseURL(): string {
    return process.env.DATABASE_URL;
  }

  static get EstablishmentUUID(): string {
    return '6a2e075b-8ddf-4165-970a-273d952c0b96';
  }

  static get CDN_URL(): string {
    return process.env.CDN_URL;
  }

  static get CDN_KEY_ID(): string {
    return process.env.CDN_KEY_ID;
  }

  static get CDN_PASSWORD(): string {
    return process.env.CDN_PASSWORD;
  }

  static get CDN_REGION(): string {
    return process.env.CDN_REGION;
  }
  static get MelhorEnvioToken(): string {
    return process.env.MELHOR_ENVIO_TOKEN;
  }

  static get AssasToken(): string {
    return process.env.ASSAS_TOKEN;
  }
}
