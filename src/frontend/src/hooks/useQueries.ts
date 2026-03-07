import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Member, Project, UpcomingProject } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllMembers() {
  const { actor, isFetching } = useActor();
  return useQuery<Member[]>({
    queryKey: ["members"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMembers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllProjects() {
  const { actor, isFetching } = useActor();
  return useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProjects();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllUpcomingProjects() {
  const { actor, isFetching } = useActor();
  return useQuery<UpcomingProject[]>({
    queryKey: ["upcomingProjects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUpcomingProjects();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetWishlistCount() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["wishlistCount"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getWishlistCount();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10000,
  });
}

export function useIsWishlisted() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isWishlisted"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isWishlisted();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsProjectRevealed() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isProjectRevealed"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isProjectRevealed();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 8000,
  });
}

export function useGetClubInfo() {
  const { actor, isFetching } = useActor();
  return useQuery<{ version: string; foundingYear: bigint }>({
    queryKey: ["clubInfo"],
    queryFn: async () => {
      if (!actor) return { version: "2.0", foundingYear: BigInt(2024) };
      return actor.getClubInfo();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetVisitorCount() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["visitorCount"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getVisitorCount();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddWishlist() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.addWishlist();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlistCount"] });
      queryClient.invalidateQueries({ queryKey: ["isWishlisted"] });
      queryClient.invalidateQueries({ queryKey: ["isProjectRevealed"] });
    },
  });
}

export function useRemoveWishlist() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.removeWishlist();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlistCount"] });
      queryClient.invalidateQueries({ queryKey: ["isWishlisted"] });
      queryClient.invalidateQueries({ queryKey: ["isProjectRevealed"] });
    },
  });
}

export function useIncrementVisitor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) return;
      return actor.incrementVisitor();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visitorCount"] });
    },
  });
}
