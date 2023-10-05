import { User } from "../shared/user";

const Ana : User = {
    id: 1,
    name: 'Ana',
    status: 'Online',
    wins: 10,
    color: '#C9FFE5',
    avatar: 'https://picsum.photos/100',
      friends: [],
      level: 0,
      matches: 0
  };

  const Bob : User = {
    id: 2,
    name: 'Bob',
    status: 'Online',
    wins: 5,
    color: '#C9CBFF',
    avatar: 'https://picsum.photos/100',
      friends: [],
      level: 0,
      matches: 0
  };

  const Carl : User = {
    id: 3,
    name: 'Carl',
    status: 'Offline',
    wins: 2,
    color: '#FFC9C9',
    avatar: 'https://picsum.photos/100',
      friends: [],
      level: 0,
      matches: 0
  };

  export const dummyUsers: User[] = [Ana, Bob, Carl];