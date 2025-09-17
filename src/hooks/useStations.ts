import { useQuery } from "@tanstack/react-query";
import { stationService } from "../services/api/stations";

export const useStations = () => {
  return useQuery({
    queryKey: ["stations"],
    queryFn: stationService.getAllStations,
  });
};

export const useStation = (stationId: string) => {
  return useQuery({
    queryKey: ["station", stationId],
    queryFn: () => stationService.getStationById(stationId),
    enabled: !!stationId,
  });
};
