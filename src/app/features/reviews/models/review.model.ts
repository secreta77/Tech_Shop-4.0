export interface ReviewUserDetails {
    pictureUrl: string | null;
  }
  
  export interface ReviewUser {
    id: number;
    firstName: string;
    lastName: string;
    details: ReviewUserDetails;
  }
  
  export interface Review {
    id: number;
    rating: number;
    createdAt: string;
    user: ReviewUser;
  }
  
  export interface ReviewsPage {
    items: Review[];
    totalCount: number;
  }