/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { db } from '@/lib/db';
import { ProductStatus, SeoType } from '@prisma/client';
import { ProductInput } from '../schemas/product';
import { Decimal } from '@prisma/client/runtime/library';

export class ProductRepository {
  /**
   * Get all products with filters, sorting, and pagination
   */
  async getProducts(params: {
    search?: string;
    category?: string;
    brand?: string;
    status?: ProductStatus;
    sortBy?: string;
    page?: number;
    limit?: number;
  }) {
    const {
      search,
      category,
      brand,
      status,
      sortBy = 'newest',
      page = 1,
      limit = 10,
    } = params;

    const skip = (page - 1) * limit;

    const where: any = {};

    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        {
          variants: {
            some: {
              sku: { contains: search, mode: 'insensitive' },
            },
          },
        },
      ];
    }

    // Status filter
    if (status) {
      where.status = status;
    } else {
      // By default, exclude deleted (or keep all for admin dashboard)
    }

    // Brand filter
    if (brand && brand !== 'ALL') {
      where.brand = { name: brand };
    }

    // Category filter
    if (category && category !== 'ALL') {
      where.productCategories = {
        some: {
          category: {
            name: category,
          },
        },
      };
    }

    // Sort order
    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'price-low-high') {
      orderBy = { variants: { _min: { price: 'asc' } } };
    } else if (sortBy === 'price-high-low') {
      orderBy = { variants: { _max: { price: 'desc' } } };
    } else if (sortBy === 'title-asc') {
      orderBy = { title: 'asc' };
    } else if (sortBy === 'title-desc') {
      orderBy = { title: 'desc' };
    }

    const [items, total] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          brand: true,
          images: {
            orderBy: { sortOrder: 'asc' },
          },
          productCategories: {
            include: {
              category: true,
            },
          },
          productCollections: {
            include: {
              collection: true,
            },
          },
          variants: {
            include: {
              inventoryItem: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      db.product.count({ where }),
    ]);

    return { items, total };
  }

  /**
   * Get product by ID
   */
  async getProductById(id: string) {
    const product = await db.product.findUnique({
      where: { id },
      include: {
        brand: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        productCategories: {
          include: {
            category: true,
          },
        },
        productCollections: {
          include: {
            collection: true,
          },
        },
        variants: {
          include: {
            inventoryItem: true,
            variantAttributes: {
              include: {
                attributeValue: {
                  include: {
                    attribute: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!product) return null;

    // Get SEO Metadata
    const seo = await db.seoMetadata.findUnique({
      where: {
        entityType_entityId: {
          entityType: SeoType.PRODUCT,
          entityId: id,
        },
      },
    });

    return { ...product, seo };
  }

  /**
   * Create a new product with variants, media, links, inventory, and SEO
   */
  async createProduct(data: ProductInput) {
    return db.$transaction(async (tx) => {
      // 1. Create base product
      const product = await tx.product.create({
        data: {
          title: data.title,
          slug: data.slug,
          description: data.description,
          status: data.status,
          isFeatured: data.isFeatured,
          brandId: data.brandId || null,
        },
      });

      // 2. Categories mapping
      if (data.categoryIds && data.categoryIds.length > 0) {
        await tx.productCategory.createMany({
          data: data.categoryIds.map((cid) => ({
            productId: product.id,
            categoryId: cid,
          })),
        });
      }

      // 3. Collections mapping
      if (data.collectionIds && data.collectionIds.length > 0) {
        await tx.productCollection.createMany({
          data: data.collectionIds.map((colId) => ({
            productId: product.id,
            collectionId: colId,
          })),
        });
      }

      // 4. Create Product Images
      if (data.images && data.images.length > 0) {
        await tx.productImage.createMany({
          data: data.images.map((img) => ({
            productId: product.id,
            url: img.url,
            altText: img.altText || null,
            sortOrder: img.sortOrder,
          })),
        });
      }

      // 5. Create Variants
      for (const variant of data.variants) {
        const createdVariant = await tx.productVariant.create({
          data: {
            productId: product.id,
            sku: variant.sku,
            barcode: variant.barcode || null,
            price: new Decimal(variant.price),
            comparePrice: variant.comparePrice ? new Decimal(variant.comparePrice) : null,
            costPrice: variant.costPrice ? new Decimal(variant.costPrice) : null,
            weight: variant.weight ? new Decimal(variant.weight) : null,
            width: variant.width ? new Decimal(variant.width) : null,
            height: variant.height ? new Decimal(variant.height) : null,
            length: variant.length ? new Decimal(variant.length) : null,
            isActive: variant.isActive,
          },
        });

        // 5a. Create InventoryItem
        await tx.inventoryItem.create({
          data: {
            variantId: createdVariant.id,
            quantity: variant.quantity,
          },
        });

        // 5b. Handle Variant Attributes
        if (variant.attributes && variant.attributes.length > 0) {
          for (const attr of variant.attributes) {
            const attrCode = attr.name.toLowerCase().replace(/\s+/g, '-');
            
            // Find or create Attribute
            const attribute = await tx.attribute.upsert({
              where: { code: attrCode },
              update: {},
              create: {
                name: attr.name,
                code: attrCode,
              },
            });

            // Find or create AttributeValue
            const attributeVal = await tx.attributeValue.findFirst({
              where: { attributeId: attribute.id, value: attr.value },
            }) || await tx.attributeValue.create({
              data: {
                attributeId: attribute.id,
                value: attr.value,
                label: attr.value,
              },
            });

            // Link via VariantAttribute
            await tx.variantAttribute.create({
              data: {
                variantId: createdVariant.id,
                attributeValueId: attributeVal.id,
              },
            });

            // Link Attribute to Product if not already linked
            await tx.productAttribute.upsert({
              where: {
                productId_attributeId: {
                  productId: product.id,
                  attributeId: attribute.id,
                },
              },
              update: {},
              create: {
                productId: product.id,
                attributeId: attribute.id,
              },
            });
          }
        }
      }

      // 6. Create SEO metadata
      if (data.seoTitle || data.seoDescription) {
        await tx.seoMetadata.create({
          data: {
            entityType: SeoType.PRODUCT,
            entityId: product.id,
            metaTitle: data.seoTitle || null,
            metaDescription: data.seoDescription || null,
            canonicalUrl: data.canonicalUrl || null,
            ogImage: data.ogImage || null,
          },
        });
      }

    }, { maxWait: 15000, timeout: 30000 });
  }

  /**
   * Update existing product
   */
  async updateProduct(id: string, data: ProductInput) {
    return db.$transaction(async (tx) => {
      // 1. Update base product
      const product = await tx.product.update({
        where: { id },
        data: {
          title: data.title,
          slug: data.slug,
          description: data.description,
          status: data.status,
          isFeatured: data.isFeatured,
          brandId: data.brandId || null,
        },
      });

      // 2. Categories links rebuild
      await tx.productCategory.deleteMany({ where: { productId: id } });
      if (data.categoryIds && data.categoryIds.length > 0) {
        await tx.productCategory.createMany({
          data: data.categoryIds.map((cid) => ({
            productId: id,
            categoryId: cid,
          })),
        });
      }

      // 3. Collections links rebuild
      await tx.productCollection.deleteMany({ where: { productId: id } });
      if (data.collectionIds && data.collectionIds.length > 0) {
        await tx.productCollection.createMany({
          data: data.collectionIds.map((colId) => ({
            productId: id,
            collectionId: colId,
          })),
        });
      }

      // 4. Product Images rebuild
      await tx.productImage.deleteMany({ where: { productId: id } });
      if (data.images && data.images.length > 0) {
        await tx.productImage.createMany({
          data: data.images.map((img) => ({
            productId: id,
            url: img.url,
            altText: img.altText || null,
            sortOrder: img.sortOrder,
          })),
        });
      }

      // 5. Variants update/create/deactivate
      const existingVariants = await tx.productVariant.findMany({
        where: { productId: id },
        include: { inventoryItem: true },
      });

      const updatedSkus = data.variants.map((v) => v.sku);
      
      const variantsToDeactivate = existingVariants.filter((ev) => !updatedSkus.includes(ev.sku));
      for (const ev of variantsToDeactivate) {
        await tx.productVariant.update({
          where: { id: ev.id },
          data: { isActive: false },
        });
      }

      for (const variant of data.variants) {
        const existing = existingVariants.find((ev) => ev.sku === variant.sku);
        let variantId: string;
        
        if (existing) {
          variantId = existing.id;
          await tx.productVariant.update({
            where: { id: variantId },
            data: {
              barcode: variant.barcode || null,
              price: new Decimal(variant.price),
              comparePrice: variant.comparePrice ? new Decimal(variant.comparePrice) : null,
              costPrice: variant.costPrice ? new Decimal(variant.costPrice) : null,
              weight: variant.weight ? new Decimal(variant.weight) : null,
              width: variant.width ? new Decimal(variant.width) : null,
              height: variant.height ? new Decimal(variant.height) : null,
              length: variant.length ? new Decimal(variant.length) : null,
              isActive: variant.isActive,
            },
          });

          if (existing.inventoryItem) {
            await tx.inventoryItem.update({
              where: { id: existing.inventoryItem.id },
              data: { quantity: variant.quantity },
            });
          } else {
            await tx.inventoryItem.create({
              data: {
                variantId,
                quantity: variant.quantity,
              },
            });
          }
        } else {
          const createdVariant = await tx.productVariant.create({
            data: {
              productId: id,
              sku: variant.sku,
              barcode: variant.barcode || null,
              price: new Decimal(variant.price),
              comparePrice: variant.comparePrice ? new Decimal(variant.comparePrice) : null,
              costPrice: variant.costPrice ? new Decimal(variant.costPrice) : null,
              weight: variant.weight ? new Decimal(variant.weight) : null,
              width: variant.width ? new Decimal(variant.width) : null,
              height: variant.height ? new Decimal(variant.height) : null,
              length: variant.length ? new Decimal(variant.length) : null,
              isActive: variant.isActive,
            },
          });
          variantId = createdVariant.id;

          await tx.inventoryItem.create({
            data: {
              variantId,
              quantity: variant.quantity,
            },
          });
        }

        await tx.variantAttribute.deleteMany({ where: { variantId } });

        if (variant.attributes && variant.attributes.length > 0) {
          for (const attr of variant.attributes) {
            const attrCode = attr.name.toLowerCase().replace(/\s+/g, '-');
            
            const attribute = await tx.attribute.upsert({
              where: { code: attrCode },
              update: {},
              create: {
                name: attr.name,
                code: attrCode,
              },
            });

            const attributeVal = await tx.attributeValue.findFirst({
              where: { attributeId: attribute.id, value: attr.value },
            }) || await tx.attributeValue.create({
              data: {
                attributeId: attribute.id,
                value: attr.value,
                label: attr.value,
              },
            });

            await tx.variantAttribute.create({
              data: {
                variantId,
                attributeValueId: attributeVal.id,
              },
            });

            await tx.productAttribute.upsert({
              where: {
                productId_attributeId: {
                  productId: id,
                  attributeId: attribute.id,
                },
              },
              update: {},
              create: {
                productId: id,
                attributeId: attribute.id,
              },
            });
          }
        }
      }

      // 6. SEO metadata rebuild
      await tx.seoMetadata.upsert({
        where: {
          entityType_entityId: {
            entityType: SeoType.PRODUCT,
            entityId: id,
          },
        },
        update: {
          metaTitle: data.seoTitle || null,
          metaDescription: data.seoDescription || null,
          canonicalUrl: data.canonicalUrl || null,
          ogImage: data.ogImage || null,
        },
        create: {
          entityType: SeoType.PRODUCT,
          entityId: id,
          metaTitle: data.seoTitle || null,
          metaDescription: data.seoDescription || null,
          canonicalUrl: data.canonicalUrl || null,
          ogImage: data.ogImage || null,
        },
      });

      return product;
    }, { maxWait: 15000, timeout: 30000 });
  }

  /**
   * Delete product (supports soft delete/archive or hard delete)
   */
  async deleteProduct(id: string, soft = true) {
    if (soft) {
      return db.product.update({
        where: { id },
        data: { status: ProductStatus.ARCHIVED },
      });
    } else {
      return db.product.delete({
        where: { id },
      });
    }
  }

  /**
   * Restore archived product
   */
  async restoreProduct(id: string) {
    return db.product.update({
      where: { id },
      data: { status: ProductStatus.DRAFT },
    });
  }

  /**
   * Bulk actions
   */
  async bulkDelete(ids: string[]) {
    return db.product.updateMany({
      where: { id: { in: ids } },
      data: { status: ProductStatus.ARCHIVED },
    });
  }

  async bulkUpdateStatus(ids: string[], status: ProductStatus) {
    return db.product.updateMany({
      where: { id: { in: ids } },
      data: { status },
    });
  }
}
export default ProductRepository;
