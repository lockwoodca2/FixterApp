// Environment bindings for Cloudflare Workers
export interface Env {
  DATABASE_URL: string;
  JWT_SECRET: string;
  STRIPE_SECRET_KEY?: string;
  R2_BUCKET: R2Bucket;
  R2_PUBLIC_URL: string;
}
