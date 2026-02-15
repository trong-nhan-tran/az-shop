import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CustomerAddress {
  province: string;
  ward: string;
  address: string;
}

interface CustomerStore {
  // Customer info matching orderInputSchema
  customerName: string;
  phoneNumber: string;

  // Address info
  street: string;
  province: string;
  ward: string;

  // Actions
  setCustomerName: (name: string) => void;
  setPhoneNumber: (phone: string) => void;
  setStreet: (street: string) => void;
  setProvince: (province: string) => void;
  setWard: (ward: string) => void;

  resetCustomerData: () => void;
}

export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set, get) => ({
      // Initial state
      customerName: "",
      phoneNumber: "",
      street: "",
      province: "",
      ward: "",

      // Actions
      setCustomerName: (name) => set({ customerName: name }),
      setPhoneNumber: (phone) => set({ phoneNumber: phone }),
      setStreet: (street) => set({ street: street }),
      setProvince: (province) => set({ province: province }),
      setWard: (ward) => set({ ward: ward }),

      resetCustomerData: () =>
        set({
          customerName: "",
          phoneNumber: "",
          street: "",
          province: "",
          ward: "",
        }),
    }),
    {
      name: "apple-zone-customer",
      // Only save to localStorage the customer data that should persist
      partialize: (state) => ({
        customerName: state.customerName,
        phoneNumber: state.phoneNumber,
        street: state.street,
        province: state.province,
        ward: state.ward,
      }),
    }
  )
);
