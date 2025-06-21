
export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  points: number;
  badges: string[];
}

export interface Evidence {
  id: string;
  userId: string;
  text: string;
  link?: string;
  submittedAt: Date;
}

export interface NewsSubmission {
  id: string;
  title: string;
  content: string;
  submittedBy: string; // userId
  submittedAt: Date;
  aiScore: number;
  upvotes: number;
  downvotes: number;
  evidence: Evidence[];
}
