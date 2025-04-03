export interface AuthInterface {
  email: string;
  password: string;
  // rememberMe: boolean;
}

export interface SocialLoginAuth {
  name: string;
  email: string;
  auth_type: string;
  social_id: string;
  social_token: any;
}

export interface RegisterType {
  name: string;
  email: string;
  password: string;
}

export interface ForgotType {
  email: string;
}

export interface ChangeType {
  id: string;
  password: string;
  confirm_password: string;
}
export interface UpdateType {
  password_old: string;
  password: string;
  password_confirmation: string;
}
export interface VerifyType {
  userid: string;
}
