import { db } from '@/lib/db';

export class BrandRepository {
  async getBrands() {
    const list = await db.brand.findMany({
      include: {
        products: true,
      },
      orderBy: { name: 'asc' },
    });

    const parsed = [];
    for (const b of list) {
      const setting = await db.storeSetting.findUnique({
        where: { key: `brand_metadata_${b.id}` },
      });
      const extra = setting
        ? (setting.value as SafeAny)
        : { description: '', isActive: true, seoTitle: '', seoDescription: '' };
      parsed.push({
        ...b,
        description: extra.description || '',
        isActive: extra.isActive !== undefined ? extra.isActive : true,
        seoTitle: extra.seoTitle || '',
        seoDescription: extra.seoDescription || '',
      });
    }
    return parsed;
  }

  async getBrandById(id: string) {
    const brand = await db.brand.findUnique({
      where: { id },
    });
    if (!brand) return null;

    const setting = await db.storeSetting.findUnique({
      where: { key: `brand_metadata_${brand.id}` },
    });
    const extra = setting
      ? (setting.value as SafeAny)
      : { description: '', isActive: true, seoTitle: '', seoDescription: '' };
    return {
      ...brand,
      description: extra.description || '',
      isActive: extra.isActive !== undefined ? extra.isActive : true,
      seoTitle: extra.seoTitle || '',
      seoDescription: extra.seoDescription || '',
    };
  }

  async createBrand(data: {
    name: string;
    slug: string;
    logoUrl?: string;
    description?: string;
    isActive: boolean;
    seoTitle?: string;
    seoDescription?: string;
  }) {
    return db.$transaction(async (tx) => {
      const brand = await tx.brand.create({
        data: {
          name: data.name,
          slug: data.slug,
          logoUrl: data.logoUrl || null,
        },
      });

      await tx.storeSetting.create({
        data: {
          key: `brand_metadata_${brand.id}`,
          group: 'BRAND_METADATA',
          value: {
            description: data.description || '',
            isActive: data.isActive,
            seoTitle: data.seoTitle || '',
            seoDescription: data.seoDescription || '',
          },
        },
      });

      return brand;
    });
  }

  async updateBrand(
    id: string,
    data: {
      name: string;
      slug: string;
      logoUrl?: string;
      description?: string;
      isActive: boolean;
      seoTitle?: string;
      seoDescription?: string;
    },
  ) {
    return db.$transaction(async (tx) => {
      const brand = await tx.brand.update({
        where: { id },
        data: {
          name: data.name,
          slug: data.slug,
          logoUrl: data.logoUrl || null,
        },
      });

      await tx.storeSetting.upsert({
        where: { key: `brand_metadata_${id}` },
        update: {
          value: {
            description: data.description || '',
            isActive: data.isActive,
            seoTitle: data.seoTitle || '',
            seoDescription: data.seoDescription || '',
          },
        },
        create: {
          key: `brand_metadata_${id}`,
          group: 'BRAND_METADATA',
          value: {
            description: data.description || '',
            isActive: data.isActive,
            seoTitle: data.seoTitle || '',
            seoDescription: data.seoDescription || '',
          },
        },
      });

      return brand;
    });
  }

  async deleteBrand(id: string) {
    return db.$transaction(async (tx) => {
      await tx.storeSetting.deleteMany({
        where: { key: `brand_metadata_${id}` },
      });
      return tx.brand.delete({
        where: { id },
      });
    });
  }
}
export default BrandRepository;
