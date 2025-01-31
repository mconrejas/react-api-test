export interface Referral {
  first_name: string;
  last_name: string;
  email: string;
  prefix: string;
  phone: number;
  home_name?: string;
  street?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  country?: string;
  avatar?: string;
}

// Define the stored referral type
export interface ReferralWithId extends Referral { id: number };