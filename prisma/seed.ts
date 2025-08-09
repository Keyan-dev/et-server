import { PrismaClient } from '@prisma/client';
import { category } from '../src/seed_data';
const prisma = new PrismaClient()
async function seed() {
    const categories = await prisma.category.createMany({ data: category.map((e) => { return { name: e.name } }) as any, skipDuplicates: true });
    console.log("categories..", categories);

}
seed().then(() => { prisma.$disconnect(); })