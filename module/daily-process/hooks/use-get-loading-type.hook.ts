import { useMemo } from 'react';

interface IUseGetLoadingTypeProps {
  networkLoading: boolean;
  cacheCondition: boolean;
}

const useGetLoadingType = ({
  cacheCondition,
  networkLoading,
}: IUseGetLoadingTypeProps) => {
  const loadingType = useMemo(() => {
    if (!networkLoading) {
      return 'finish';
    }

    if (cacheCondition) {
      return 'withCacheLoading';
    }

    return 'noCacheLoading';
  }, [cacheCondition, networkLoading]);

  return loadingType;
};

export default useGetLoadingType;
