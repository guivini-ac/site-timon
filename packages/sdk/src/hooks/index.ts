import { useState, useEffect, useCallback } from 'react';
import type { CMSClient } from '../client';
import type { 
  Post, 
  Page, 
  Media, 
  Taxonomy, 
  Menu, 
  ContentEntry, 
  Collection,
  QueryParams,
  ApiResponse 
} from '../types';

// Hook genérico para fetch de dados
function useAsyncData<T>(
  fetchFn: () => Promise<ApiResponse<T>>,
  deps: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchFn();
      setData(response.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const refetch = useCallback(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch };
}

// Hooks específicos para cada tipo de conteúdo
export function usePosts(client: CMSClient, params?: QueryParams) {
  return useAsyncData(
    () => client.getPosts(params),
    [client, JSON.stringify(params)]
  );
}

export function usePost(client: CMSClient, id: string, params?: Pick<QueryParams, 'fields' | 'expand' | 'locale'>) {
  return useAsyncData(
    () => client.getPost(id, params),
    [client, id, JSON.stringify(params)]
  );
}

export function usePostBySlug(client: CMSClient, slug: string, params?: Pick<QueryParams, 'fields' | 'expand' | 'locale'>) {
  return useAsyncData(
    () => client.getPostBySlug(slug, params),
    [client, slug, JSON.stringify(params)]
  );
}

export function usePages(client: CMSClient, params?: QueryParams) {
  return useAsyncData(
    () => client.getPages(params),
    [client, JSON.stringify(params)]
  );
}

export function usePage(client: CMSClient, id: string, params?: Pick<QueryParams, 'fields' | 'expand' | 'locale'>) {
  return useAsyncData(
    () => client.getPage(id, params),
    [client, id, JSON.stringify(params)]
  );
}

export function usePageBySlug(client: CMSClient, slug: string, params?: Pick<QueryParams, 'fields' | 'expand' | 'locale'>) {
  return useAsyncData(
    () => client.getPageBySlug(slug, params),
    [client, slug, JSON.stringify(params)]
  );
}

export function useMedia(client: CMSClient, params?: QueryParams) {
  return useAsyncData(
    () => client.getMedia(params),
    [client, JSON.stringify(params)]
  );
}

export function useMediaItem(client: CMSClient, id: string) {
  return useAsyncData(
    () => client.getMediaItem(id),
    [client, id]
  );
}

export function useTaxonomies(client: CMSClient, type?: string, params?: QueryParams) {
  return useAsyncData(
    () => client.getTaxonomies(type, params),
    [client, type, JSON.stringify(params)]
  );
}

export function useTaxonomy(client: CMSClient, id: string, params?: Pick<QueryParams, 'fields' | 'expand' | 'locale'>) {
  return useAsyncData(
    () => client.getTaxonomy(id, params),
    [client, id, JSON.stringify(params)]
  );
}

export function useMenus(client: CMSClient) {
  return useAsyncData(
    () => client.getMenus(),
    [client]
  );
}

export function useMenu(client: CMSClient, id: string, params?: Pick<QueryParams, 'locale'>) {
  return useAsyncData(
    () => client.getMenu(id, params),
    [client, id, JSON.stringify(params)]
  );
}

export function useMenuByLocation(client: CMSClient, location: string, params?: Pick<QueryParams, 'locale'>) {
  return useAsyncData(
    () => client.getMenuByLocation(location, params),
    [client, location, JSON.stringify(params)]
  );
}

export function useCollections(client: CMSClient) {
  return useAsyncData(
    () => client.getCollections(),
    [client]
  );
}

export function useCollection(client: CMSClient, key: string) {
  return useAsyncData(
    () => client.getCollection(key),
    [client, key]
  );
}

export function useEntries(client: CMSClient, collection: string, params?: QueryParams) {
  return useAsyncData(
    () => client.getEntries(collection, params),
    [client, collection, JSON.stringify(params)]
  );
}

export function useEntry(client: CMSClient, collection: string, id: string, params?: Pick<QueryParams, 'fields' | 'expand' | 'locale'>) {
  return useAsyncData(
    () => client.getEntry(collection, id, params),
    [client, collection, id, JSON.stringify(params)]
  );
}

export function useSearch(client: CMSClient, query: string, params?: { collections?: string[]; limit?: number; locale?: string }) {
  return useAsyncData(
    () => client.search(query, params),
    [client, query, JSON.stringify(params)]
  );
}

// Hook para upload de mídia com progresso
export function useMediaUpload(client: CMSClient) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const upload = useCallback(async (file: File, options?: { folder?: string; alt?: string; title?: string }) => {
    try {
      setUploading(true);
      setError(null);
      setProgress(0);

      const response = await client.uploadMedia(file, {
        ...options,
        onProgress: (progress) => {
          setProgress(progress.percentage);
        }
      });

      return response.data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [client]);

  return { upload, uploading, progress, error };
}