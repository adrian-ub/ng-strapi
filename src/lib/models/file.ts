export interface File {
  name: string;
  sha256: string;
  hash: string;
  ext: string;
  size: string;
  mime: string;
  url: string;
  provider: string;
  updatedAt: string;
  createdAt: string;
  related: string[];
}
