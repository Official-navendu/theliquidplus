import { db } from '@/lib/db';
import { BlogStatus, SeoType } from '@prisma/client';

export class CmsRepository {
  // ==========================================
  // PAGES CRUD
  // ==========================================
  async getPages() {
    return db.cmsPage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPageById(id: string) {
    const page = await db.cmsPage.findUnique({
      where: { id },
    });
    if (!page) return null;

    const seo = await db.seoMetadata.findUnique({
      where: {
        entityType_entityId: {
          entityType: SeoType.PAGE,
          entityId: id,
        },
      },
    });

    return { ...page, seo };
  }

  async createPage(data: {
    title: string;
    slug: string;
    content: string;
    isActive: boolean;
    seoTitle?: string;
    seoDescription?: string;
  }) {
    return db.$transaction(async (tx) => {
      const page = await tx.cmsPage.create({
        data: {
          title: data.title,
          slug: data.slug,
          content: data.content,
          isActive: data.isActive,
        },
      });

      if (data.seoTitle || data.seoDescription) {
        await tx.seoMetadata.create({
          data: {
            entityType: SeoType.PAGE,
            entityId: page.id,
            metaTitle: data.seoTitle || null,
            metaDescription: data.seoDescription || null,
          },
        });
      }

      return page;
    });
  }

  async updatePage(
    id: string,
    data: {
      title: string;
      slug: string;
      content: string;
      isActive: boolean;
      seoTitle?: string;
      seoDescription?: string;
    }
  ) {
    return db.$transaction(async (tx) => {
      const page = await tx.cmsPage.update({
        where: { id },
        data: {
          title: data.title,
          slug: data.slug,
          content: data.content,
          isActive: data.isActive,
        },
      });

      await tx.seoMetadata.upsert({
        where: {
          entityType_entityId: {
            entityType: SeoType.PAGE,
            entityId: id,
          },
        },
        update: {
          metaTitle: data.seoTitle || null,
          metaDescription: data.seoDescription || null,
        },
        create: {
          entityType: SeoType.PAGE,
          entityId: id,
          metaTitle: data.seoTitle || null,
          metaDescription: data.seoDescription || null,
        },
      });

      return page;
    });
  }

  async deletePage(id: string) {
    return db.cmsPage.delete({
      where: { id },
    });
  }

  // ==========================================
  // BLOG POSTS CRUD
  // ==========================================
  async getBlogPosts() {
    return db.blogPost.findMany({
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBlogPostById(id: string) {
    const post = await db.blogPost.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
    if (!post) return null;

    const seo = await db.seoMetadata.findUnique({
      where: {
        entityType_entityId: {
          entityType: SeoType.BLOG,
          entityId: id,
        },
      },
    });

    return { ...post, seo };
  }

  async createBlogPost(data: {
    title: string;
    slug: string;
    content: string;
    status: BlogStatus;
    authorId: string;
    categoryId: string;
    featuredImage?: string;
    publishedAt?: Date | null;
    seoTitle?: string;
    seoDescription?: string;
  }) {
    return db.$transaction(async (tx) => {
      const post = await tx.blogPost.create({
        data: {
          title: data.title,
          slug: data.slug,
          content: data.content,
          status: data.status,
          authorId: data.authorId,
          categoryId: data.categoryId,
          featuredImage: data.featuredImage || null,
          publishedAt: data.publishedAt || null,
        },
      });

      if (data.seoTitle || data.seoDescription) {
        await tx.seoMetadata.create({
          data: {
            entityType: SeoType.BLOG,
            entityId: post.id,
            metaTitle: data.seoTitle || null,
            metaDescription: data.seoDescription || null,
          },
        });
      }

      return post;
    });
  }

  async updateBlogPost(
    id: string,
    data: {
      title: string;
      slug: string;
      content: string;
      status: BlogStatus;
      categoryId: string;
      featuredImage?: string;
      publishedAt?: Date | null;
      seoTitle?: string;
      seoDescription?: string;
    }
  ) {
    return db.$transaction(async (tx) => {
      const post = await tx.blogPost.update({
        where: { id },
        data: {
          title: data.title,
          slug: data.slug,
          content: data.content,
          status: data.status,
          categoryId: data.categoryId,
          featuredImage: data.featuredImage || null,
          publishedAt: data.publishedAt || null,
        },
      });

      await tx.seoMetadata.upsert({
        where: {
          entityType_entityId: {
            entityType: SeoType.BLOG,
            entityId: id,
          },
        },
        update: {
          metaTitle: data.seoTitle || null,
          metaDescription: data.seoDescription || null,
        },
        create: {
          entityType: SeoType.BLOG,
          entityId: id,
          metaTitle: data.seoTitle || null,
          metaDescription: data.seoDescription || null,
        },
      });

      return post;
    });
  }

  async deleteBlogPost(id: string) {
    return db.blogPost.delete({
      where: { id },
    });
  }

  // ==========================================
  // SETUP / CATEGORIES HELPERS
  // ==========================================
  async getBlogCategories() {
    return db.blogCategory.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async createBlogCategory(name: string, slug: string) {
    return db.blogCategory.create({
      data: { name, slug },
    });
  }
}
export default CmsRepository;
