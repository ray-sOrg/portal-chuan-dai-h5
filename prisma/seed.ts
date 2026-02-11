import { PrismaClient, DishCategory } from '@prisma/client';

const prisma = new PrismaClient();

const DISHES = [
  // 川菜 - 开胃菜
  {
    name: '口水鸡',
    nameEn: 'Mouthwatering Chicken',
    description: '经典川菜，鸡肉鲜嫩，麻辣红油浇汁，香气扑鼻',
    descEn: 'Classic Sichuan dish with tender chicken in spicy chili oil',
    price: 38.00,
    image: '/dishes/kou-shui-ji.jpg',
    category: 'APPETIZER' as DishCategory,
    isSpicy: true,
    isVegetarian: false,
  },
  {
    name: '夫妻肺片',
    nameEn: "Couple's Sliced Beef",
    description: '牛杂经典，麻辣鲜香，下酒必备',
    descEn: 'Sliced beef and offal in spicy sauce',
    price: 42.00,
    image: '/dishes/fu-qi-fei-pian.jpg',
    category: 'APPETIZER' as DishCategory,
    isSpicy: true,
    isVegetarian: false,
  },
  {
    name: '凉拌木耳',
    nameEn: 'Wood Ear Salad',
    description: '清爽开胃，黑木耳配酸辣汁',
    descEn: 'Wood ear mushrooms with spicy vinegar dressing',
    price: 22.00,
    image: '/dishes/liang-ban-mu-er.jpg',
    category: 'APPETIZER' as DishCategory,
    isSpicy: false,
    isVegetarian: true,
  },

  // 川菜 - 主菜
  {
    name: '宫保鸡丁',
    nameEn: 'Kung Pao Chicken',
    description: '鸡丁、花生、干辣椒快炒，甜辣交织',
    descEn: 'Diced chicken with peanuts and dried chilies',
    price: 48.00,
    image: '/dishes/gong-bao-ji-ding.jpg',
    category: 'MAIN_COURSE' as DishCategory,
    isSpicy: true,
    isVegetarian: false,
  },
  {
    name: '麻婆豆腐',
    nameEn: 'Mapo Tofu',
    description: '嫩豆腐配牛肉末，麻辣鲜香',
    descEn: 'Silken tofu with minced pork in chili bean sauce',
    price: 28.00,
    image: '/dishes/ma-po-dou-fu.jpg',
    category: 'MAIN_COURSE' as DishCategory,
    isSpicy: true,
    isVegetarian: false,
  },
  {
    name: '水煮牛肉',
    nameEn: 'Boiled Beef in Chili Sauce',
    description: '牛肉片在红油汤中煮熟，麻辣过瘾',
    descEn: 'Sliced beef cooked in spicy chili oil',
    price: 58.00,
    image: '/dishes/shui-zhu-niu-rou.jpg',
    category: 'MAIN_COURSE' as DishCategory,
    isSpicy: true,
    isVegetarian: false,
  },
  {
    name: '回锅肉',
    nameEn: 'Twice-Cooked Pork',
    description: '五花肉先煮后炒，肥而不腻',
    descEn: 'Twice-cooked pork belly with fermented soybeans',
    price: 45.00,
    image: '/dishes/hui-guo-rou.jpg',
    category: 'MAIN_COURSE' as DishCategory,
    isSpicy: true,
    isVegetarian: false,
  },
  {
    name: '鱼香肉丝',
    nameEn: 'Yu Xiang Shredded Pork',
    description: '猪肉丝配木耳丝，酸甜微辣',
    descEn: 'Shredded pork with wood ear mushrooms in garlic sauce',
    price: 32.00,
    image: '/dishes/yu-xiang-rou-si.jpg',
    category: 'MAIN_COURSE' as DishCategory,
    isSpicy: false,
    isVegetarian: false,
  },

  // 傣味 - 汤品
  {
    name: '酸笋鱼汤',
    nameEn: 'Bamboo Shoot Fish Soup',
    description: '傣族特色，酸笋与鱼同煮，开胃解腻',
    descEn: 'Fish soup with fermented bamboo shoots',
    price: 52.00,
    image: '/dishes/suan-sun-yu-tang.jpg',
    category: 'SOUP' as DishCategory,
    isSpicy: true,
    isVegetarian: false,
  },
  {
    name: '柠檬虾',
    nameEn: 'Lemon Shrimp',
    description: '新鲜虾仁配柠檬汁，酸辣清爽',
    descEn: 'Fresh shrimp with lemon and chili',
    price: 48.00,
    image: '/dishes/ning-meng-xia.jpg',
    category: 'SOUP' as DishCategory,
    isSpicy: true,
    isVegetarian: false,
  },

  // 傣味 - 主菜
  {
    name: '香茅草烤鱼',
    nameEn: 'Lemongrass Grilled Fish',
    description: '用香茅草腌制后烤制，香气独特',
    descEn: 'Fish grilled with lemongrass',
    price: 68.00,
    image: '/dishes/xiang-mao-cao-kao-yu.jpg',
    category: 'MAIN_COURSE' as DishCategory,
    isSpicy: true,
    isVegetarian: false,
  },
  {
    name: '傣味鬼鸡',
    nameEn: 'Dai Style Spicy Chicken',
    description: '凉拌鸡肉，酸辣开胃',
    descEn: 'Spicy and sour cold chicken',
    price: 42.00,
    image: '/dishes/dai-wei-gui-ji.jpg',
    category: 'APPETIZER' as DishCategory,
    isSpicy: true,
    isVegetarian: false,
  },
  {
    name: '包烧脑花',
    nameEn: 'Grilled Brain in Banana Leaf',
    description: '用芭蕉叶包烧脑花，风味独特',
    descEn: 'Pig brain grilled in banana leaf',
    price: 35.00,
    image: '/dishes/bao-shao-nao-hua.jpg',
    category: 'MAIN_COURSE' as DishCategory,
    isSpicy: true,
    isVegetarian: false,
  },

  // 甜点
  {
    name: '紫米露',
    nameEn: 'Purple Rice Drink',
    description: '傣族传统甜品，紫米椰浆',
    descEn: 'Purple rice with coconut milk',
    price: 18.00,
    image: '/dishes/zi-mi-lu.jpg',
    category: 'DESSERT' as DishCategory,
    isSpicy: false,
    isVegetarian: true,
  },
  {
    name: '芒果糯米饭',
    nameEn: 'Mango Sticky Rice',
    description: '香甜芒果配椰浆糯米饭',
    descEn: 'Sticky rice with fresh mango and coconut milk',
    price: 25.00,
    image: '/dishes/mang-guo-nuo-mi-fan.jpg',
    category: 'DESSERT' as DishCategory,
    isSpicy: false,
    isVegetarian: true,
  },

  // 饮品
  {
    name: '鲜榨芒果汁',
    nameEn: 'Fresh Mango Juice',
    description: '新鲜芒果现榨',
    descEn: 'Fresh squeezed mango juice',
    price: 15.00,
    image: '/dishes/mang-guo-zha.jpg',
    category: 'BEVERAGE' as DishCategory,
    isSpicy: false,
    isVegetarian: true,
  },
  {
    name: '酸角汁',
    nameEn: 'Tamarind Juice',
    description: '天然酸角熬制，酸甜可口',
    descEn: 'Tamarind drink',
    price: 12.00,
    image: '/dishes/suan-jiao-zhi.jpg',
    category: 'BEVERAGE' as DishCategory,
    isSpicy: false,
    isVegetarian: true,
  },
];

async function main() {
  console.log('🌱 开始添加菜品数据...');

  // 清空现有数据
  await prisma.favorite.deleteMany();
  await prisma.dish.deleteMany();

  // 添加菜品
  for (const dish of DISHES) {
    await prisma.dish.create({
      data: dish,
    });
    console.log(`✅ 添加菜品: ${dish.name}`);
  }

  console.log(`\n🎉 共添加 ${DISHES.length} 个菜品`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
