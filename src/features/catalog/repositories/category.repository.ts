import { db } from '@/lib/db';
import { SeoType } from '@prisma/client';

export class CategoryRepository {
  async getCategories() {
    return db.category.findMany({
      include: {
        parent: true,
        _count: {
          select: { productCategories: true },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getCategoryById(id: string) {
    const category = await db.category.findUnique({
      where: { id },
      include: {
        parent: true,
      },
    });

    if (!category) return null;

    const seo = await db.seoMetadata.findUnique({
      where: {
        entityType_entityId: {
          entityType: SeoType.CATEGORY,
          entityId: id,
        },
      },
    });

    return { ...category, seo };
  }

  async createCategory(data: {
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    parentId?: string | null;
    status: boolean;
    sortOrder: number;
    seoTitle?: string;
    seoDescription?: string;
    canonicalUrl?: string;
  }) {
    return db.$transaction(async (tx) => {
      const category = await tx.category.create({
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description || null,
          imageUrl: data.imageUrl || null,
          parentId: data.parentId || null,
          status: data.status,
          sortOrder: data.sortOrder,
        },
      });

      if (data.seoTitle || data.seoDescription) {
        await tx.seoMetadata.create({
          data: {
            entityType: SeoType.CATEGORY,
            entityId: category.id,
            metaTitle: data.seoTitle || null,
            metaDescription: data.seoDescription || null,
            canonicalUrl: data.canonicalUrl || null,
          },
        });
      }

      return category;
    });
  }

  async updateCategory(
    id: string,
    data: {
      name: string;
      slug: string;
      description?: string;
      imageUrl?: string;
      parentId?: string | null;
      status: boolean;
      sortOrder: number;
      seoTitle?: string;
      seoDescription?: string;
      canonicalUrl?: string;
    }
  ) {
    return db.$transaction(async (tx) => {
      const category = await tx.category.update({
        where: { id },
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description || null,
          imageUrl: data.imageUrl || null,
          parentId: data.parentId || null,
          status: data.status,
          sortOrder: data.sortOrder,
        },
      });

      await tx.seoMetadata.upsert({
        where: {
          entityType_entityId: {
            entityType: SeoType.CATEGORY,
            entityId: id,
          },
        },
        update: {
          metaTitle: data.seoTitle || null,
          metaDescription: data.seoDescription || null,
          canonicalUrl: data.canonicalUrl || null,
        },
        create: {
          entityType: SeoType.CATEGORY,
          entityId: id,
          metaTitle: data.seoTitle || null,
          metaDescription: data.seoDescription || null,
          canonicalUrl: data.canonicalUrl || null,
        },
      });

      return category;
    });
  }

  async deleteCategory(id: string) {
    return db.category.delete({
      where: { id },
    });
  }
}
export default CategoryRepository;
