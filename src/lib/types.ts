
export interface User {
  id: string;
  name: string;
  points: number;
  badges: string[];
}

export interface Evidence {
  id: string;
  userId: string;
  text: string;
  link?: string;
  submittedAt: string;
}

export interface NewsSubmission {
  id: string;
  title: string;
  content: string;
  submittedBy: string; // userId
  submittedAt: string;
  aiScore: number;
  upvotes: number;
  downvotes: number;
  evidence: Evidence[];
  upvotedBy?: { [key: string]: boolean };
  downvotedBy?: { [key: string]: boolean };
}
