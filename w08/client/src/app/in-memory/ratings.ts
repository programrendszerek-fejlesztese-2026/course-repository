import { Rating } from './models';

export const RATINGS: Rating[] = [
  { id: '1', userId: '2', recipeId: '1', score: 5, comment: 'Nagyon finom!', createdAt: new Date() },
  { id: '2', userId: '1', recipeId: '2', score: 4, comment: 'Jól sikerült, de lehetne kevésbé olajos.', createdAt: new Date() },
];
