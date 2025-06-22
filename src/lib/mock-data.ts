
import type { User, NewsSubmission } from './types';

export const mockUsers: User[] = [
  { id: 'u1', name: 'Aarav Sharma', points: 2540, badges: ['Top Verifier', 'Pioneer'] },
  { id: 'u2', name: 'Priya Patel', points: 2310, badges: ['Top Verifier'] },
  { id: 'u3', name: 'John Smith', points: 2150, badges: ['Contributor'] },
  { id: 'u4', name: 'Rohan Gupta', points: 1980, badges: ['Pioneer'] },
  { id: 'u5', name: 'Ananya Singh', points: 1850, badges: ['Contributor'] },
  { id: 'u6', name: 'Emily White', points: 1720, badges: [] },
  { id: 'u7', name: 'Vikram Reddy', points: 1650, badges: ['Contributor'] },
  { id: 'u8', name: 'Sneha Rao', points: 1510, badges: [] },
  { id: 'u9', name: 'Aditya Kumar', points: 1420, badges: ['Pioneer'] },
  { id: 'u10', name: 'Wei Chen', points: 1300, badges: ['Contributor'] },
  { id: 'u11', name: 'Isha Desai', points: 1180, badges: [] },
  { id: 'u12', name: 'Karan Mehta', points: 990, badges: [] },
  { id: 'u13', name: 'Mohammed Al-Jamil', points: 850, badges: ['Contributor'] },
  { id: 'u14', name: 'Diya Joshi', points: 720, badges: [] },
  { id: 'u15', name: 'Arjun Nair', points: 610, badges: [] },
  { id: 'u16', name: 'Aisha Begum', points: 450, badges: [] },
  { id: 'u17', name: 'Rajesh Kannan', points: 280, badges: [] },
];

export const mockSubmissions: NewsSubmission[] = [
  {
    id: 's1',
    title: 'Study Claims Chocolate Cures Common Cold',
    content: 'A new controversial study published by the Institute of Sweet Science suggests that daily consumption of dark chocolate can effectively cure the common cold within 24 hours. Researchers point to the high levels of theobromine as the active agent.',
    submittedBy: 'u2',
    submittedAt: new Date('2024-07-15T10:00:00Z').toISOString(),
    aiScore: 35,
    upvotes: 12,
    downvotes: 88,
    evidence: [
      { id: 'e1', userId: 'u1', text: 'This claim is unsubstantiated. Major health organizations do not support this. See NHS website.', link: 'https://www.nhs.uk/conditions/common-cold/', submittedAt: new Date('2024-07-15T11:30:00Z').toISOString() },
      { id: 'e2', userId: 'u3', text: 'The "Institute of Sweet Science" appears to be a fictional entity with no credible publications.', submittedAt: new Date('2024-07-15T12:00:00Z').toISOString() }
    ],
  },
  {
    id: 's2',
    title: 'Local squirrels have learned to use currency',
    content: 'Eyewitnesses in a downtown park report seeing squirrels exchanging acorns for coins with street vendors. Experts are baffled by this unprecedented leap in animal intelligence, suggesting a new era of inter-species economy.',
    submittedBy: 'u4',
    submittedAt: new Date('2024-07-14T18:45:00Z').toISOString(),
    aiScore: 5,
    upvotes: 2,
    downvotes: 150,
    evidence: [
        { id: 'e3', userId: 'u1', text: 'This is highly improbable and likely a satirical piece. No credible news outlets are reporting this.', submittedAt: new Date('2024-07-14T19:00:00Z').toISOString() }
    ],
  },
    {
    id: 's3',
    title: 'City Council Approves Plan for New Public Library Downtown',
    content: 'The city council voted unanimously to approve the construction of a new three-story public library at the corner of Main St. and 4th Ave. Construction is set to begin in September and is expected to complete by 2026.',
    submittedBy: 'u3',
    submittedAt: new Date('2024-07-16T09:20:00Z').toISOString(),
    aiScore: 95,
    upvotes: 115,
    downvotes: 3,
    evidence: [
        { id: 'e4', userId: 'u2', text: 'Confirmed. The meeting minutes are available on the city\'s official website.', link: 'https://example.com/city-council-minutes', submittedAt: new Date('2024-07-16T09:45:00Z').toISOString() }
    ],
  },
];
