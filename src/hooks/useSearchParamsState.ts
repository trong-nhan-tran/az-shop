import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

export function useSearchParamsState<
  T extends Record<string, string | number | boolean>
>(defaultValues: T) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const getParams = useCallback(() => {
    const params = {} as Record<string, string | number | boolean>;

    Object.entries(defaultValues).forEach(([key, defaultValue]) => {
      const paramValue = searchParams.get(key);

      if (paramValue !== null) {
        if (typeof defaultValue === "number") {
          params[key] = Number(paramValue);
        } else {
          params[key] = paramValue;
        }
      } else {
        params[key] = defaultValue;
      }
    });

    return params as T;
  }, [searchParams, defaultValues]);

  const updateSearchParams = useCallback(
    (newParams: URLSearchParams) => {
      // Remove page=1 as it's the default and doesn't need to be in URL
      if (newParams.get("page") === "1") {
        newParams.delete("page");
      }

      const search = newParams.toString();
      const query = search ? `?${search}` : "";
      router.push(`${pathname}${query}`);
    },
    [pathname, router]
  );

  const setParam = useCallback(
    (key: keyof T, value: string | number) => {
      const newParams = new URLSearchParams(Array.from(searchParams.entries()));

      if (value === "" || value === undefined || value === null) {
        newParams.delete(String(key));
      } else {
        newParams.set(String(key), String(value));
      }

      updateSearchParams(newParams);
    },
    [searchParams, updateSearchParams]
  );

  const setParams = useCallback(
    (params: Partial<T>) => {
      const newParams = new URLSearchParams(Array.from(searchParams.entries()));

      Object.entries(params).forEach(([key, value]) => {
        if (value === "" || value === undefined || value === null) {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });

      updateSearchParams(newParams);
    },
    [searchParams, updateSearchParams]
  );

  const setFilterParams = useCallback(
    (params: Partial<T>) => {
      const newParams = new URLSearchParams(Array.from(searchParams.entries()));

      if (searchParams.get("page") && searchParams.get("page") !== "1") {
        newParams.set("page", "1");
      } else {
        newParams.delete("page");
      }

      Object.entries(params).forEach(([key, value]) => {
        if (value === "" || value === undefined || value === null) {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });

      updateSearchParams(newParams);
    },
    [searchParams, updateSearchParams]
  );

  const resetParams = useCallback(() => {
    router.push(pathname);
  }, [pathname, router]);

  const getQueryString = useCallback(() => {
    return searchParams.toString();
  }, [searchParams]);

  return {
    params: getParams(),
    setParam,
    setParams,
    setFilterParams,
    resetParams,
    getQueryString,
    searchParams,
  };
}
