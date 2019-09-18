import { CookieConfig } from './cookieConfig';
import { LocalStorageConfig } from './localStorageConfig';

export interface StoreConfig {
  cookie?: CookieConfig | false;
  localStorage?: LocalStorageConfig | false;
}
