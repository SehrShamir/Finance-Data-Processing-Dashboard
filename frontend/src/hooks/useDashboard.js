import { useQuery } from '@tanstack/react-query';
import { getSummary, getTrends, getCategories, getRecent } from '../api/dashboard.api';

export const useSummary = (params) =>
  useQuery({
    queryKey: ['dashboard', 'summary', params],
    queryFn: () => getSummary(params),
  });

export const useTrends = (params) =>
  useQuery({
    queryKey: ['dashboard', 'trends', params],
    queryFn: () => getTrends(params),
  });

export const useCategories = (params) =>
  useQuery({
    queryKey: ['dashboard', 'categories', params],
    queryFn: () => getCategories(params),
  });

export const useRecent = () =>
  useQuery({
    queryKey: ['dashboard', 'recent'],
    queryFn: getRecent,
  });
