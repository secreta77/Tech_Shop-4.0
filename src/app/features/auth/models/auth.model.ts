export interface LoginRequest {
    email:string
    password:string


}

export interface RegisterRequest{
    firstName:string
    lastName:string
    email:string
    password:string
}


export interface VerifyEmailRequest {
    email: string;
    code: string;
  }
  
  export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
  }

export interface AuthStat {
  value: string;
  label: string;
}

export interface AuthFeature {
  icon: string;
  title: string;
  text: string;
}
