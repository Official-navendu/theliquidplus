/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { db } from '@/lib/db';
import { SeoType } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function getAllSeoRoutesAction() {
  try {
    const products = await db.product.findMany({ select: { id: true, title: true, slug: true } });
    const categories = await db.category.findMany({ select: { id: true, name: true, slug: true } });
    const cmsPages = await db.cmsPage.findMany({ select: { id: true, title: true, slug: true } });

    // Static pages
    const staticPages = [
      { id: 'home', title: 'Homepage', slug: '/' },
      { id: 'shop', title: 'Shop', slug: '/shop' },
      { id: 'contact', title: 'Contact Us', slug: '/contact' },
      { id: 'about', title: 'About Us', slug: '/about' },
      { id: 'account', title: 'Customer Account', slug: '/account' },
      { id: 'cart', title: 'Shopping Cart', slug: '/cart' },
      { id: 'checkout', title: 'Checkout', slug: '/checkout' },
    ];

    // Fetch existing metadata
    const metadataList = await db.seoMetadata.findMany();

    const routes: any[] = [];

    // Add static routes
    for (const sp of staticPages) {
      const meta = metadataList.find(m => m.entityType === SeoType.PAGE && m.entityId === sp.id);
      routes.push({
        id: sp.id,
        type: 'PAGE',
        name: sp.title,
        route: sp.slug,
        metaTitle: meta?.metaTitle || '',
        metaDescription: meta?.metaDescription || '',
        canonicalUrl: meta?.canonicalUrl || '',
        ogImage: meta?.ogImage || '',
        jsonLd: meta?.jsonLd ? JSON.stringify(meta.jsonLd) : '',
      });
    }

    // Add categories
    for (const cat of categories) {
      const meta = metadataList.find(m => m.entityType === SeoType.CATEGORY && m.entityId === cat.id);
      routes.push({
        id: cat.id,
        type: 'CATEGORY',
        name: cat.name,
        route: `/categories/${cat.slug}`,
        metaTitle: meta?.metaTitle || '',
        metaDescription: meta?.metaDescription || '',
        canonicalUrl: meta?.canonicalUrl || '',
        ogImage: meta?.ogImage || '',
        jsonLd: meta?.jsonLd ? JSON.stringify(meta.jsonLd) : '',
      });
    }

    // Add products
    for (const prod of products) {
      const meta = metadataList.find(m => m.entityType === SeoType.PRODUCT && m.entityId === prod.id);
      routes.push({
        id: prod.id,
        type: 'PRODUCT',
        name: prod.title,
        route: `/products/${prod.slug}`,
        metaTitle: meta?.metaTitle || '',
        metaDescription: meta?.metaDescription || '',
        canonicalUrl: meta?.canonicalUrl || '',
        ogImage: meta?.ogImage || '',
        jsonLd: meta?.jsonLd ? JSON.stringify(meta.jsonLd) : '',
      });
    }

    // Add CMS pages
    for (const page of cmsPages) {
      const meta = metadataList.find(m => m.entityType === SeoType.PAGE && m.entityId === page.id);
      routes.push({
        id: page.id,
        type: 'PAGE',
        name: page.title,
        route: `/${page.slug}`,
        metaTitle: meta?.metaTitle || '',
        metaDescription: meta?.metaDescription || '',
        canonicalUrl: meta?.canonicalUrl || '',
        ogImage: meta?.ogImage || '',
        jsonLd: meta?.jsonLd ? JSON.stringify(meta.jsonLd) : '',
      });
    }

    return { success: true, data: routes };
  } catch (error: any) {
    return { success: false, error: { message: error.message } };
  }
}

export async function saveSeoMetadataAction(data: {
  entityId: string;
  entityType: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogImage: string;
  jsonLd: string;
}) {
  try {
    const jsonLdParsed = data.jsonLd ? JSON.parse(data.jsonLd) : undefined;

    await db.seoMetadata.upsert({
      where: {
        entityType_entityId: {
          entityType: data.entityType as SeoType,
          entityId: data.entityId,
        },
      },
      update: {
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        canonicalUrl: data.canonicalUrl || null,
        ogImage: data.ogImage || null,
        jsonLd: jsonLdParsed || null,
      },
      create: {
        entityId: data.entityId,
        entityType: data.entityType as SeoType,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        canonicalUrl: data.canonicalUrl || null,
        ogImage: data.ogImage || null,
        jsonLd: jsonLdParsed || null,
      },
    });

    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: { message: error.message } };
  }
}
