import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Member {
    id: bigint;
    accessLevel: bigint;
    joinYear: bigint;
    name: string;
    role: string;
}
export interface Project {
    id: bigint;
    status: string;
    name: string;
    year: bigint;
    description: string;
}
export interface UserProfile {
    name: string;
}
export interface UpcomingProject {
    id: bigint;
    name: string;
    description: string;
    progress: bigint;
    expectedYear: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMember(id: bigint, name: string, role: string, accessLevel: bigint, joinYear: bigint): Promise<void>;
    addProject(id: bigint, name: string, description: string, year: bigint, status: string): Promise<void>;
    addUpcomingProject(id: bigint, name: string, description: string, expectedYear: bigint, progress: bigint): Promise<void>;
    addWishlist(): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllMembers(): Promise<Array<Member>>;
    getAllProjects(): Promise<Array<Project>>;
    getAllUpcomingProjects(): Promise<Array<UpcomingProject>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getClubInfo(): Promise<{
        version: string;
        foundingYear: bigint;
    }>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVisitorCount(): Promise<bigint>;
    getWishlistCount(): Promise<bigint>;
    incrementVisitor(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isProjectRevealed(): Promise<boolean>;
    isWishlisted(): Promise<boolean>;
    removeWishlist(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
