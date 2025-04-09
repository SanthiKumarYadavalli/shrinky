
export interface Link {
  _id: string;
  userId: string;
  originalURL: string;
  shortCode: string;
  customAlias?: string;
  createdAt: string;
  expiresAt?: string;
  totalClicks: number;
}

export interface ClickData {
  _id: string;
  urlId: string;
  createdAt: string;
  ipAddress: string;
  browser: string;
  operatingSystem: string;
  device: string;
}

export interface CreateLinkParams {
  originalURL: string;
  customAlias?: string;
  expiresAt?: string;
}
