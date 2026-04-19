import { User } from './models';

export const USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@recept.hu',
    role: 'admin',
    // bcrypt hash copied from server/docker-init/mongo-init.js (demo only)
    password: '$2b$10$zmGcZceXHBvJuKAwFOavl.6yseuAJ.MYp28qYhNWJ/a.TimoyWGCC',
    createdAt: new Date(),
  },
  {
    id: '2',
    username: 'pista',
    email: 'pista@recept.hu',
    role: 'user',
    password: '$2b$10$TaSUwUtX.WVbp7BCTVrEN.wjkJiz11x.y4a8MKh3tCe.P9JlnFi5O',
    createdAt: new Date(),
  },
];
