import { Recipe } from './models';

export const RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Gulyásleves',
    description: 'Magyar klasszikus marhahúsból, zöldségekkel.',
    categoryId: '1',
    ingredients: [
      { name: 'marhahús', quantity: '500 g' },
      { name: 'burgonya', quantity: '3 db' },
      { name: 'sárgarépa', quantity: '2 db' },
    ],
    createdBy: '1',
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Rántott hús',
    description: 'Sertéshús panírozva, olajban sütve.',
    categoryId: '2',
    ingredients: [
      { name: 'sertéshús', quantity: '4 szelet' },
      { name: 'tojás', quantity: '2 db' },
      { name: 'zsemlemorzsa', quantity: '100 g' },
    ],
    createdBy: '2',
    createdAt: new Date(),
  },
  {
    id: '3',
    title: 'Somlói galuska',
    description: 'Híres magyar desszert piskótával és csokoládéval.',
    categoryId: '3',
    ingredients: [
      { name: 'piskóta', quantity: '3 szelet' },
      { name: 'csokoládé', quantity: '50 g' },
      { name: 'tejszín', quantity: '100 ml' },
    ],
    createdBy: '1',
    createdAt: new Date(),
  },
];
