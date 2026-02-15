import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types
export interface Province {
  value: string;
  label: string;
}

export interface Ward {
  value: string;
  label: string;
}

interface ProvinceWardState {
  // Data
  provinces: Province[];
  allWards: Record<string, Ward[]>;
  currentWards: Ward[];

  // Lookup maps for fast access
  provinceLookup: Record<string, string>; // code -> name
  wardLookup: Record<string, string>; // code -> name

  // Loading states
  isLoading: boolean;

  // Actions
  fetchAddressData: () => Promise<void>;
  getWardsForProvince: (provinceId: string) => Ward[];
  clearWards: () => void;
  getProvinceName: (code: string) => string;
  getWardName: (code: string) => string;
}

export const useAddressStore = create<ProvinceWardState>()(
  persist(
    (set, get) => ({
      // Initial state
      provinces: [],
      allWards: {},
      currentWards: [],
      provinceLookup: {},
      wardLookup: {},
      isLoading: false,

      // Actions
      fetchAddressData: async () => {
        const { provinces, allWards } = get();

        // If data is already loaded, don't fetch again
        if (provinces.length > 0 && Object.keys(allWards).length > 0) {
          return;
        }

        set({ isLoading: true });

        try {
          // Fetch both provinces and wards data in parallel
          const [provincesResponse, wardsResponse] = await Promise.all([
            fetch("/jsons/provinces.json"),
            fetch("/jsons/wards.json"),
          ]);

          const [provincesData, wardsData] = await Promise.all([
            provincesResponse.json(),
            wardsResponse.json(),
          ]);

          // Convert provinces to the format expected by SelectWithSearch
          const provinces: Province[] = Object.entries(provincesData).map(
            ([key, value]) => ({
              value: key,
              label: value as string,
            })
          );

          // Create province lookup map for fast access
          const provinceLookup: Record<string, string> = {};
          provinces.forEach((province) => {
            provinceLookup[province.value] = province.label;
          });

          // Convert wards data to organized structure
          const allWards: Record<string, Ward[]> = {};
          const wardLookup: Record<string, string> = {};

          Object.entries(wardsData).forEach(([provinceId, provinceWards]) => {
            const wards = Object.entries(
              provinceWards as Record<string, string>
            ).map(([key, value]) => ({
              value: key,
              label: value,
            }));

            allWards[provinceId] = wards;

            // Create ward lookup map for fast access
            wards.forEach((ward) => {
              wardLookup[ward.value] = ward.label;
            });
          });

          set({
            provinces,
            allWards,
            provinceLookup,
            wardLookup,
            isLoading: false,
          });
        } catch (error) {
          console.error("Error fetching address data:", error);
          set({ isLoading: false });
        }
      },

      getWardsForProvince: (provinceId: string) => {
        const { allWards } = get();

        // Get wards for the selected province from pre-loaded data
        const wards = allWards[provinceId] || [];

        // Update current wards in state
        set({ currentWards: wards });

        return wards;
      },

      clearWards: () => {
        set({ currentWards: [] });
      },

      getProvinceName: (code: string) => {
        const { provinceLookup } = get();
        return provinceLookup[code] || code;
      },

      getWardName: (code: string) => {
        const { wardLookup } = get();
        return wardLookup[code] || code;
      },
    }),
    {
      name: "apple-zone-address",
      // Persist all data including lookup maps to avoid re-fetching
      partialize: (state) => ({
        provinces: state.provinces,
        allWards: state.allWards,
        provinceLookup: state.provinceLookup,
        wardLookup: state.wardLookup,
      }),
    }
  )
);
