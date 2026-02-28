export interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
}

export const products: Product[] = [
    // Cookware
    { id: 1, name: '8pc Cookware Set', price: 19.99, image: '/Store/PotSet.webp', category: 'Cookware' },
    { id: 2, name: '12pc Cookware Set', price: 29.99, image: '/Store/PotSet12.webp', category: 'Cookware' },
    { id: 3, name: '16pc Cookware Set B', price: 39.99, image: '/Store/PotSet16.webp', category: 'Cookware' },
    { id: 4, name: '16pc Cookware Set R', price: 49.99, image: '/Store/RedPotSet16.webp', category: 'Cookware' },
    // Knives & Blenders
    { id: 5, name: '12pc Knife Set', price: 19.99, image: '/Store/knife15.webp', category: 'Knives & Blenders' },
    { id: 6, name: '15pc Knife Set', price: 29.99, image: '/Store/knife15W.webp', category: 'Knives & Blenders' },
    { id: 7, name: 'Blender', price: 39.99, image: '/Store/Blender2.webp', category: 'Knives & Blenders' },
    { id: 8, name: 'Blender Pro', price: 49.99, image: '/Store/Blender1.webp', category: 'Knives & Blenders' },
    // Bowls & Plates
    { id: 9, name: 'Bowl Set', price: 19.99, image: '/Store/Bowls.webp', category: 'Bowls & Plates' },
    { id: 10, name: 'Bowl Set Deluxe', price: 29.99, image: '/Store/Bowls2.webp', category: 'Bowls & Plates' },
    { id: 11, name: '12 Plates Set', price: 39.99, image: '/Store/12Plates.webp', category: 'Bowls & Plates' },
    { id: 12, name: '16 Plates Set', price: 49.99, image: '/Store/16Plates.webp', category: 'Bowls & Plates' },
    // Spices
    { id: 13, name: 'Chilli Powder', price: 2.99, image: '/Store/Chilli.webp', category: 'Spices' },
    { id: 14, name: 'Curry Powder', price: 2.99, image: '/Store/Curry.png', category: 'Spices' },
    { id: 15, name: 'Garlic Powder', price: 2.99, image: '/Store/Garlic.png', category: 'Spices' },
    { id: 16, name: 'Oregano Leaves', price: 2.99, image: '/Store/Oregano.png', category: 'Spices' },
];
