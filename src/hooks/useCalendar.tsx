
import { useGetCalendar } from "./useGetCalendar";
import { useMutateCalendar } from "./useMutateCalendar";

export const useCalendar = () => {
    const getCalendar = useGetCalendar
    const {allMutate,deleteMutation,patchMutation,postMutation} = useMutateCalendar()

    return {
        
        getCalendar,
        allMutate,
        deleteMutation,
        patchMutation,
        postMutation
        
    }
};