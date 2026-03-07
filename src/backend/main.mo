import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Set "mo:core/Set";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  // Persistent Data Types
  type Project = {
    id : Nat;
    name : Text;
    description : Text;
    year : Nat;
    status : Text;
  };

  type UpcomingProject = {
    id : Nat;
    name : Text;
    description : Text;
    expectedYear : Nat;
    progress : Nat; // 0-100
  };

  type Member = {
    id : Nat;
    name : Text;
    role : Text;
    accessLevel : Nat;
    joinYear : Nat;
  };

  // Persistent data structures
  let wishlists = Map.empty<Principal, Bool>();
  let members = Map.empty<Nat, Member>();
  let projects = Map.empty<Nat, Project>();
  let upcomingProjects = Map.empty<Nat, UpcomingProject>();
  let visitors = Set.empty<Principal>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let wishlistAnon = Map.empty<Text, Bool>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Persistent Wishlist (Principal-based)
  public shared ({ caller }) func addWishlist() : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can add to wishlist");
    };
    switch (wishlists.get(caller)) {
      case (null) {
        wishlists.add(caller, true);
        checkReveal();
        true;
      };
      case (?_) { false };
    };
  };

  public shared ({ caller }) func removeWishlist() : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can remove from wishlist");
    };
    switch (wishlists.get(caller)) {
      case (null) { false };
      case (?_) {
        wishlists.remove(caller);
        true;
      };
    };
  };

  public query ({ caller }) func isWishlisted() : async Bool {
    switch (wishlists.get(caller)) {
      case (null) { false };
      case (?_) { true };
    };
  };

  // Anonymous Wishlist functions (Text-based)
  public shared ({ caller }) func addWishlistAnon(token : Text) : async Bool {
    if (token.size() == 0) {
      return false;
    };

    switch (wishlistAnon.get(token)) {
      case (null) {
        wishlistAnon.add(token, true);
        checkReveal();
        true;
      };
      case (?_) { false };
    };
  };

  public shared ({ caller }) func removeWishlistAnon(token : Text) : async Bool {
    if (token.size() == 0) {
      return false;
    };

    switch (wishlistAnon.get(token)) {
      case (null) { false };
      case (?_) {
        wishlistAnon.remove(token);
        true;
      };
    };
  };

  public query ({ caller }) func isWishlistedAnon(token : Text) : async Bool {
    switch (wishlistAnon.get(token)) {
      case (null) { false };
      case (?_) { true };
    };
  };

  public query ({ caller }) func getWishlistCount() : async Nat {
    wishlistAnon.size() + wishlists.size();
  };

  public query ({ caller }) func isProjectRevealed() : async Bool {
    (wishlistAnon.size() + wishlists.size()) >= 200;
  };

  func checkReveal() {
    let totalCount = wishlistAnon.size() + wishlists.size();
    if (totalCount >= 200) {
      // Project revealed logic (could trigger an event/notification)
    };
  };

  // Project Management
  public shared ({ caller }) func addProject(id : Nat, name : Text, description : Text, year : Nat, status : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add projects");
    };
    let project : Project = {
      id;
      name;
      description;
      year;
      status;
    };
    projects.add(id, project);
  };

  public query ({ caller }) func getAllProjects() : async [Project] {
    projects.values().toArray().sort(
      func(p1 : Project, p2 : Project) : Order.Order {
        Nat.compare(p1.id, p2.id);
      },
    );
  };

  public shared ({ caller }) func addUpcomingProject(id : Nat, name : Text, description : Text, expectedYear : Nat, progress : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add upcoming projects");
    };
    let upcoming : UpcomingProject = {
      id;
      name;
      description;
      expectedYear;
      progress;
    };
    upcomingProjects.add(id, upcoming);
  };

  public query ({ caller }) func getAllUpcomingProjects() : async [UpcomingProject] {
    upcomingProjects.values().toArray().sort(
      func(p1 : UpcomingProject, p2 : UpcomingProject) : Order.Order {
        Nat.compare(p1.id, p2.id);
      },
    );
  };

  // Team Members Management
  public shared ({ caller }) func addMember(id : Nat, name : Text, role : Text, accessLevel : Nat, joinYear : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add members");
    };
    let member : Member = {
      id;
      name;
      role;
      accessLevel;
      joinYear;
    };
    members.add(id, member);
  };

  public query ({ caller }) func getAllMembers() : async [Member] {
    members.values().toArray().sort(
      func(m1 : Member, m2 : Member) : Order.Order {
        Nat.compare(m1.id, m2.id);
      },
    );
  };

  // System Stats
  public shared ({ caller }) func incrementVisitor() : async () {
    visitors.add(caller);
  };

  public query ({ caller }) func getVisitorCount() : async Nat {
    visitors.size();
  };

  public query ({ caller }) func getClubInfo() : async {
    foundingYear : Nat;
    version : Text;
  } {
    { foundingYear = 2024; version = "2.0" };
  };
};
