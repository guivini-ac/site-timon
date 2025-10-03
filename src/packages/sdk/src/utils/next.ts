import type { CMSClient } from '../client';
import type { Post, Page, ContentEntry, QueryParams } from '../types';

// Helpers para Next.js SSG/SSR

// Para getStaticProps
export async function getStaticProps<T>(
  client: CMSClient,
  fetchFn: () => Promise<{ data: T }>,
  revalidate: number = 3600
) {
  try {
    const response = await fetchFn();
    
    return {
      props: {
        data: response.data,
        revalidate
      },
      revalidate
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      notFound: true,
      revalidate: 60 // Retry em 1 minuto em caso de erro
    };
  }
}

// Para getStaticPaths
export async function getStaticPaths(
  client: CMSClient,
  fetchFn: () => Promise<{ data: any[] }>,
  getPath: (item: any) => string
) {
  try {
    const response = await fetchFn();
    const paths = response.data.map((item) => ({
      params: { slug: getPath(item) }
    }));

    return {
      paths,
      fallback: 'blocking'
    };
  } catch (error) {
    console.error('Error in getStaticPaths:', error);
    return {
      paths: [],
      fallback: 'blocking'
    };
  }
}

// Para getServerSideProps
export async function getServerSideProps<T>(
  client: CMSClient,
  fetchFn: () => Promise<{ data: T }>
) {
  try {
    const response = await fetchFn();
    
    return {
      props: {
        data: response.data
      }
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      notFound: true
    };
  }
}

// Para App Router (generateStaticParams)
export async function generateStaticParams(
  client: CMSClient,
  fetchFn: () => Promise<{ data: any[] }>,
  getParams: (item: any) => Record<string, string>
) {
  try {
    const response = await fetchFn();
    return response.data.map(getParams);
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return [];
  }
}

// Helpers específicos para posts
export const postHelpers = {
  // getStaticProps para lista de posts
  getPostsStaticProps: (client: CMSClient, params?: QueryParams, revalidate?: number) =>
    getStaticProps(client, () => client.getPosts(params), revalidate),

  // getStaticProps para post individual
  getPostStaticProps: (client: CMSClient, slug: string, revalidate?: number) =>
    getStaticProps(client, () => client.getPostBySlug(slug), revalidate),

  // getStaticPaths para posts
  getPostsStaticPaths: (client: CMSClient, params?: QueryParams) =>
    getStaticPaths(
      client,
      () => client.getPosts(params),
      (post: Post) => post.slug
    ),

  // generateStaticParams para posts
  generatePostsStaticParams: (client: CMSClient, params?: QueryParams) =>
    generateStaticParams(
      client,
      () => client.getPosts(params),
      (post: Post) => ({ slug: post.slug })
    )
};

// Helpers específicos para páginas
export const pageHelpers = {
  // getStaticProps para lista de páginas
  getPagesStaticProps: (client: CMSClient, params?: QueryParams, revalidate?: number) =>
    getStaticProps(client, () => client.getPages(params), revalidate),

  // getStaticProps para página individual
  getPageStaticProps: (client: CMSClient, slug: string, revalidate?: number) =>
    getStaticProps(client, () => client.getPageBySlug(slug), revalidate),

  // getStaticPaths para páginas
  getPagesStaticPaths: (client: CMSClient, params?: QueryParams) =>
    getStaticPaths(
      client,
      () => client.getPages(params),
      (page: Page) => page.slug
    ),

  // generateStaticParams para páginas
  generatePagesStaticParams: (client: CMSClient, params?: QueryParams) =>
    generateStaticParams(
      client,
      () => client.getPages(params),
      (page: Page) => ({ slug: page.slug })
    )
};

// Helpers para collections customizadas
export const collectionHelpers = {
  // getStaticProps para entries de uma collection
  getEntriesStaticProps: (client: CMSClient, collection: string, params?: QueryParams, revalidate?: number) =>
    getStaticProps(client, () => client.getEntries(collection, params), revalidate),

  // getStaticProps para entry individual
  getEntryStaticProps: (client: CMSClient, collection: string, id: string, revalidate?: number) =>
    getStaticProps(client, () => client.getEntry(collection, id), revalidate),

  // getStaticPaths para entries
  getEntriesStaticPaths: (client: CMSClient, collection: string, getPath: (entry: ContentEntry) => string, params?: QueryParams) =>
    getStaticPaths(
      client,
      () => client.getEntries(collection, params),
      getPath
    ),

  // generateStaticParams para entries
  generateEntriesStaticParams: (client: CMSClient, collection: string, getParams: (entry: ContentEntry) => Record<string, string>, params?: QueryParams) =>
    generateStaticParams(
      client,
      () => client.getEntries(collection, params),
      getParams
    )
};

// Helper para preview
export async function handlePreview(
  client: CMSClient,
  token: string,
  enablePreview: (data: any) => void,
  redirect: (url: string) => void
) {
  try {
    const response = await client.getPreviewContent(token);
    enablePreview(response.data);
    
    // Redirecionar para a URL adequada baseada no tipo de conteúdo
    const { contentType, slug } = response.data;
    
    switch (contentType) {
      case 'post':
        redirect(`/posts/${slug}`);
        break;
      case 'page':
        redirect(`/${slug}`);
        break;
      default:
        redirect('/');
    }
  } catch (error) {
    console.error('Error handling preview:', error);
    redirect('/');
  }
}

// Helper para cache de páginas estáticas
export function createCacheConfig(tags: string[] = [], revalidate: number = 3600) {
  return {
    tags,
    revalidate,
    // Para App Router
    next: {
      tags,
      revalidate
    }
  };
}

// Helper para validar parâmetros de URL
export function validateSlugParam(slug: string | string[] | undefined): string | null {
  if (typeof slug === 'string') {
    return slug;
  }
  if (Array.isArray(slug) && slug.length === 1) {
    return slug[0];
  }
  return null;
}