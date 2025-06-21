
import type { User, NewsSubmission } from './types';

export const mockUsers: User[] = [
  { id: 'u1', name: 'FactFinder007', avatarUrl: 'https://placehold.co/40x40.png', points: 1250, badges: ['Top Verifier', 'Pioneer'] },
  { id: 'u2', name: 'TruthSeekerX', avatarUrl: 'https://placehold.co/40x40.png', points: 980, badges: ['Contributor'] },
  { id: 'u3', name: 'SourceScout', avatarUrl: 'https://placehold.co/40x40.png', points: 760, badges: [] },
  { id: 'u4', name: 'DebunkingDiva', avatarUrl: 'https://placehold.co/40x40.png', points: 540, badges: ['Contributor'] },
  { id: 'u5', name: 'VeracityVanguard', avatarUrl: 'https://placehold.co/40x40.png', points: 320, badges: [] },
];

export const mockSubmissions: NewsSubmission[] = [
  {
    id: 's1',
    title: 'Study Claims Chocolate Cures Common Cold',
    content: 'A new controversial study published by the Institute of Sweet Science suggests that daily consumption of dark chocolate can effectively cure the common cold within 24 hours. Researchers point to the high levels of theobromine as the active agent.',
    submittedBy: 'u2',
    submittedAt: new Date('2024-07-15T10:00:00Z'),
    aiScore: 35,
    upvotes: 12,
    downvotes: 88,
    evidence: [
      { id: 'e1', userId: 'u1', text: 'This claim is unsubstantiated. Major health organizations do not support this. See NHS website.', link: 'https://www.nhs.uk/conditions/common-cold/', submittedAt: new Date('2024-07-15T11:30:00Z') },
      { id: 'e2', userId: 'u3', text: 'The "Institute of Sweet Science" appears to be a fictional entity with no credible publications.', submittedAt: new Date('2024-07-15T12:00:00Z') }
    ],
  },
  {
    id: 's2',
    title: 'Local squirrels have learned to use currency',
    content: 'Eyewitnesses in a downtown park report seeing squirrels exchanging acorns for coins with street vendors. Experts are baffled by this unprecedented leap in animal intelligence, suggesting a new era of inter-species economy.',
    submittedBy: 'u4',
    submittedAt: new Date('2024-07-14T18:45:00Z'),
    aiScore: 5,
    upvotes: 2,
    downvotes: 150,
    evidence: [
        { id: 'e3', userId: 'u1', text: 'This is highly improbable and likely a satirical piece. No credible news outlets are reporting this.', submittedAt: new Date('2024-07-14T19:00:00Z') }
    ],
  },
    {
    id: 's3',
    title: 'City Council Approves Plan for New Public Library Downtown',
    content: 'The city council voted unanimously to approve the construction of a new three-story public library at the corner of Main St. and 4th Ave. Construction is set to begin in September and is expected to complete by 2026.',
    submittedBy: 'u3',
    submittedAt: new Date('2024-07-16T09:20:00Z'),
    aiScore: 95,
    upvotes: 115,
    downvotes: 3,
    evidence: [
        { id: 'e4', userId: 'u2', text: 'Confirmed. The meeting minutes are available on the city\'s official website.', link: 'https://example.com/city-council-minutes', submittedAt: new Date('2024-07-16T09:45:00Z') }
    ],
  },
];
