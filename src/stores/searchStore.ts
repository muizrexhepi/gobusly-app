import AsyncStorage from "@react-native-async-storage/async-storage";
import { addDays, format } from "date-fns";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface Passengers {
  adults: number;
  children: number;
}

export interface SearchState {
  from: string;
  fromCity: string;
  to: string;
  toCity: string;
  route: string;
  passengers: Passengers;
  departureDate: string | null;
  returnDate: string | null;
  tripType: "one-way" | "round-trip";
  loading: boolean;

  setFrom: (from: string) => void;
  setTo: (to: string) => void;
  setFromCity: (fromCity: string) => void;
  setToCity: (toCity: string) => void;
  setRoute: (route: string) => void;
  setPassengers: (passengers: Passengers) => void;
  setDepartureDate: (date: string | null) => void;
  setReturnDate: (date: string | null) => void;
  setTripType: (type: "one-way" | "round-trip") => void;
  setLoading: (loading: boolean) => void;
  resetSearch: () => void;
}

const initialState: Pick<
  SearchState,
  | "from"
  | "fromCity"
  | "to"
  | "toCity"
  | "route"
  | "passengers"
  | "departureDate"
  | "returnDate"
  | "tripType"
  | "loading"
> = {
  from: "",
  fromCity: "",
  to: "",
  toCity: "",
  route: "",
  passengers: { adults: 1, children: 0 },
  departureDate: format(new Date(), "dd-MM-yyyy"),
  returnDate: format(addDays(new Date(), 7), "dd-MM-yyyy"),
  tripType: "one-way",
  loading: false,
};

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      ...initialState,
      setFrom: (from) => set({ from }),
      setTo: (to) => set({ to }),
      setFromCity: (fromCity) => set({ fromCity }),
      setToCity: (toCity) => set({ toCity }),
      setRoute: (route) => set({ route }),
      setPassengers: (passengers) => set({ passengers }),
      setDepartureDate: (departureDate) => set({ departureDate }),
      setReturnDate: (returnDate) => set({ returnDate }),
      setTripType: (tripType) => set({ tripType }),
      setLoading: (loading) => set({ loading }),
      resetSearch: () =>
        set({
          ...initialState,
          departureDate: format(new Date(), "dd-MM-yyyy"),
          returnDate: format(addDays(new Date(), 7), "dd-MM-yyyy"),
        }),
    }),
    {
      name: "search-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
