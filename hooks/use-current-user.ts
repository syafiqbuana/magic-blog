// // lib/hooks/use-current-user.ts
// import { useSession } from "@/lib/session";

// export function useCurrentUser() {
//   const { data: session, isPending, error } = useSession();

//   return {
//     user: session?.user || null,
//     isPending,
//     isAuthenticated: !!session?.user,
//     error,
//   };
// }