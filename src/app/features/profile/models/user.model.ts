export interface UserDetails {
    phoneNumber: string | null;
    address: string | null;
    dob: string | null;
    pictureUrl: string | null;
  }
  
  export interface User {
    id: number;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    details: UserDetails;
  }

  export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
  }
  
  export interface UpdateProfileRequest {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string | null;
    address: string | null;
    pictureUrl: string | null;
    dateOfBirth: string | null;
  }