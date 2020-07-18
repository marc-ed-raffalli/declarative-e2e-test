export interface IMockUserPublicData {
  username: string;
  role: 'admin' | 'user';
  enabled?: boolean;
}

export interface IMockUser extends IMockUserPublicData {
  password: string;
  loginAttempts: number;
}

