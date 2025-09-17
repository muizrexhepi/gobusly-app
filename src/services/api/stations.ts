import { ApiResponse } from "@/src/types/api";
import { Station } from "@/src/types/station";
import { apiClient } from "./client";

class StationService {
  async getAllStations(): Promise<Station[]> {
    const response = await apiClient.get<ApiResponse<Station[]>>("/station");
    console.log({ stations: response.data.data });
    return response.data.data;
  }

  async getStationById(stationId: string): Promise<Station> {
    const response = await apiClient.get<ApiResponse<Station>>(
      `/stations/${stationId}`
    );
    return response.data.data;
  }
}

export const stationService = new StationService();
