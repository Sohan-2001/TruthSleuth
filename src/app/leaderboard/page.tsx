
import { mockUsers } from '@/lib/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Medal, Star, Shield } from 'lucide-react';

export default function LeaderboardPage() {
  const sortedUsers = [...mockUsers].sort((a, b) => b.points - a.points);
  
  const getRankIcon = (rank: number) => {
    if (rank === 0) return <Medal className="h-5 w-5 text-yellow-400" />;
    if (rank === 1) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-yellow-600" />;
    return <span className="text-sm font-medium">{rank + 1}</span>;
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold font-headline mb-2">Leaderboard</h1>
      <p className="text-muted-foreground mb-8">Top contributors in the fight against disinformation.</p>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px] text-center">Rank</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="text-right">Points</TableHead>
              <TableHead className="text-center">Badges</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUsers.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell className="text-center font-bold">
                    <div className="flex justify-center items-center">
                        {getRankIcon(index)}
                    </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-semibold">{user.points.toLocaleString()}</TableCell>
                <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                        {user.badges.map(badge => (
                            <Badge key={badge} variant="secondary" className="flex items-center gap-1">
                                {badge === 'Top Verifier' && <Star className="h-3 w-3 text-yellow-500"/>}
                                {badge === 'Pioneer' && <Shield className="h-3 w-3 text-blue-500"/>}
                                {badge}
                            </Badge>
                        ))}
                    </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
