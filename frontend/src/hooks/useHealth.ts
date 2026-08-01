import { useQuery } from "@tanstack/react-query";
import { checkBackendHealth } from "../services/health.service.js";

export const useHealth = () => {
  return useQuery({
    queryKey: ["health"],
    queryFn: checkBackendHealth,
  });
};