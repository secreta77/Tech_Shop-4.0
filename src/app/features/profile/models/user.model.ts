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