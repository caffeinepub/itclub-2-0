import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import type { Member, Project, UpcomingProject } from "../backend.d";
import { useActor } from "./useActor";

// ─── Anonymous browser token (localStorage UUID) ──────────────────────────────

function generateUUIDv4(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Manual UUID v4 fallback
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const ANON_TOKEN_KEY = "itclub_anon_token";

export function useAnonToken(): string {
  return useMemo(() => {
    try {
      const stored = localStorage.getItem(ANON_TOKEN_KEY);
      if (stored) return stored;
      const fresh = generateUUIDv4();
      localStorage.setItem(ANON_TOKEN_KEY, fresh);
      return fresh;
    } catch {
      // localStorage unavailable (private mode, etc.) — return ephemeral token
      return generateUUIDv4();
    }
  }, []);
}

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

// ─── Anonymous wishlist hooks (no authentication required) ───────────────────

export function useIsWishlistedAnon(token: string) {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isWishlistedAnon", token],
    queryFn: async () => {
      if (!actor || !token) return false;
      return actor.isWishlistedAnon(token);
    },
    enabled: !!actor && !isFetching && token.length > 0,
  });
}

export function useAddWishlistAnon(token: string) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.addWishlistAnon(token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlistCount"] });
      queryClient.invalidateQueries({ queryKey: ["isProjectRevealed"] });
      queryClient.invalidateQueries({ queryKey: ["isWishlistedAnon", token] });
    },
  });
}

export function useRemoveWishlistAnon(token: string) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.removeWishlistAnon(token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlistCount"] });
      queryClient.invalidateQueries({ queryKey: ["isProjectRevealed"] });
      queryClient.invalidateQueries({ queryKey: ["isWishlistedAnon", token] });
    },
  });
}
