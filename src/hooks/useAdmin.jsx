import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxios from "./useAxios"

const useAdmin = () => {
    const { user, loading } = useAuth();
    const axiosInstance = useAxios();
    
    const { data: isAdmin, isPending: isAdminLoading, error } = useQuery({
        queryKey: [user?.email, 'isAdmin'],
        enabled: !loading && !!user?.email,
        queryFn: async () => {
            try {
                const res = await axiosInstance.get(`/users/admin/${user.email}`);
                return res.data?.admin === true; // Ensure boolean return
            } catch (error) {
                console.error('Error checking admin status:', error);
                return false; // Default to false on error
            }
        },
        retry: 1,
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    })
    
    // Return boolean (default to false) and loading state
    return [isAdmin === true, isAdminLoading]
};

export default useAdmin;