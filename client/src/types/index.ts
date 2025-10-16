export interface User {
  _id: string;
  username: string;
  email: string;
  name: string;
  rollNumber: string;
  teamName?: string;
  teamMembers?: User[];
  gamesPlayed?: number;
  totalScore?: number;
  achievements?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  signup: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
}
