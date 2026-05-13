/** Client-side Firebase (and any code imported from pages/components) must use NEXT_PUBLIC_. */
export const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_WEB_API_KEY;
export const AUTH_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
export const DATABASE_URL = process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_DATABASE_URL;
export const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
export const STORAGE_BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_DEFAULT_BUCKET;
export const MESSAGING_SENDER_ID = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
export const APP_ID = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
export const MEASUREMENT_ID = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;
export const BE_DEPLOYMENT_DOMAIN =
  process.env.NEXT_PUBLIC_BE_DEPLOYMENT_DOMAIN;
