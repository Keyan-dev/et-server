import { PrismaClient } from '@prisma/client';
import { category, paymentModes } from '../src/seed_data';
const prisma = new PrismaClient()
async function seed() {
    const myCategory = [...category];
    const categories_creation = await prisma.category.createMany({ data: myCategory.map((e) => { return { name: e.name } }) as any, skipDuplicates: true });
    const categories = await prisma.category.findMany();
    const subCategoryData = [];
    for (let cat of category) {
        const cat_id = categories.find((e) => e.name == cat.name);
        if (cat_id?.id) {
            for (let subcat of cat.subCategories) {
                subCategoryData.push({
                    category_id: cat_id.id,
                    name: subcat
                })
            }
        }
    }
    const sub_categories = await prisma.sub_category.createMany({ data: subCategoryData, skipDuplicates: true });
    const formated_payment = [...paymentModes.map((e: string) => { return { name: e, code: e } })];
    const payment_modes = await prisma.payment_mode.createMany({ data: formated_payment })
}
seed().then(() => { prisma.$disconnect(); })