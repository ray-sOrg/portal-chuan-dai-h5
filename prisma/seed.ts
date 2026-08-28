import { DishCategory, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const dishImageBaseUrl = 'https://img.tt829.cn/chuan-dai/dishes';

const dishes = [
  {
    name: '盘县干锅薄荷炒吊龙',
    category: DishCategory.RECOMMENDED,
    image: `${dishImageBaseUrl}/pan-xian-gan-guo-bo-he-chao-diao-long.webp`,
  },
  {
    name: '云南傣味手舂荷包蛋',
    category: DishCategory.COLD_DISH,
    image: `${dishImageBaseUrl}/yun-nan-dai-wei-shou-chong-he-bao-dan-v2.webp`,
  },
  {
    name: '蒜香空心菜',
    category: DishCategory.SEASONAL_VEGETABLE,
    image: `${dishImageBaseUrl}/suan-xiang-kong-xin-cai.webp`,
    isVegetarian: true,
  },
  {
    name: '招牌红烧肉',
    category: DishCategory.HOT_DISH,
    image: `${dishImageBaseUrl}/zhao-pai-hong-shao-rou-v2.webp`,
  },
  {
    name: '炸酥肉',
    category: DishCategory.SNACK_STAPLE,
    image: `${dishImageBaseUrl}/zha-su-rou-v2.webp`,
  },
  {
    name: '百香果番茄煮鱼',
    category: DishCategory.SEAFOOD,
    image: `${dishImageBaseUrl}/bai-xiang-guo-fan-qie-zhu-yu.webp`,
  },
  {
    name: '糟辣鱼',
    category: DishCategory.SEAFOOD,
    image: `${dishImageBaseUrl}/zao-la-yu.webp`,
  },
  {
    name: '五粮液',
    category: DishCategory.BAIJIU,
    image: `${dishImageBaseUrl}/wu-liang-ye.webp`,
  },
  {
    name: '罗斯福10号',
    category: DishCategory.BEER,
    image: `${dishImageBaseUrl}/rochefort-10.webp`,
  },
  {
    name: '豌豆尖汤',
    category: DishCategory.SOUP,
    image: `${dishImageBaseUrl}/wan-dou-jian-tang.webp`,
    isVegetarian: true,
  },
  {
    name: '百事可乐',
    category: DishCategory.BEVERAGE,
    image: `${dishImageBaseUrl}/bai-shi-ke-le.webp`,
    isVegetarian: true,
  },
].map((dish) => ({ price: 0, ...dish }));

async function main() {
  console.log('🌱 正在更新菜品数据...');

  await prisma.favorite.deleteMany();
  await prisma.dish.deleteMany();
  const { count } = await prisma.dish.createMany({ data: dishes });

  console.log(`✅ 已添加 ${count} 道菜品`);
}

main()
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
