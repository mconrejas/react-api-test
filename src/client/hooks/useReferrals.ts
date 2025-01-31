import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import axios from "axios";

import { Referral, ReferralWithId } from "../../types/referrals";
import { setReferrals, addReferral, updateSelectedReferral, removeSelectedReferral, setSelectReferral, AppDispatch } from "../store";
import useNotification from "./useNotification";

const useReferrals = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();
  const { notify } = useNotification();

  // Fetch all referral
  const { data: referrals, isLoading: isLoadingReferrals } = useQuery<ReferralWithId[]>(
    ["referrals"],
    async () => {
      const response = await axios.get("/api/referrals");
      return response.data;
    },
    { 
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        dispatch(setReferrals(data));
      },
      onError: (error: any) => {
        notify("error", "Error", error.response?.data?.error || "Failed to fetch referrals");
      },
    }
  );

  // Function to trigger refetch for all referrals manually
  const refetchReferrals = () => {
    queryClient.invalidateQueries(["referrals"]);
  };

  // Function to trigger setSelectedReferral
  const setReferralById = (id: number | null) => {
    dispatch(setSelectReferral(id));
  }
  
  // Create referral
  const {
    mutateAsync: createReferral,
    isLoading: isCreatingReferral,
  } = useMutation(
    async (formData: Referral) => {
      const { data } = await axios.post(`/api/referrals`, formData);

      return data;
    },
    {
      onSuccess: (data) => {
        dispatch(addReferral(data));
        notify('success', 'Success', 'New referral has beed added.')
      },
      onError: (error: any) => {
        notify('error', 'Error', error.response.data.error)
      },
    }
  );
  
  // Update referral
  const {
    mutateAsync: updateReferral,
    isLoading: isUpdatingReferral,
  } = useMutation(
    async ({ id, formData }: { id: number; formData: Referral }) => {
      await axios.put(`/api/referrals/${id}`, formData);
    },
    {      
      onSuccess: (_, variables) => {
        dispatch(updateSelectedReferral(variables));
        notify('success', 'Success', 'Referral has beed updated.')
      },
      onError: (error: any) => {
        notify('error', 'Error', error.response.data.error)
      },
    }
  );

  // Delete referral
  const {
    mutateAsync: deleteReferral,
    isLoading: isDeletingReferral,
  } = useMutation(
    async (id: number) => {
      await axios.delete(`/api/referrals/${id}`);
    },
    {
      onSuccess: (_, variables) => {
        dispatch(removeSelectedReferral(variables));
        notify('success', 'Success', 'Referral has beed removed.')
      },
      onError: (error: any) => {
        notify('error', 'Error', error.response.data.error)
      },
    }
  );

  return { 
    // For bulk
    referrals, 
    isLoadingReferrals,
    refetchReferrals,

    // For specific
    setReferralById, 

    isCreatingReferral,
    createReferral,

    isUpdatingReferral,
    updateReferral,
    
    isDeletingReferral,
    deleteReferral,    
  };
};

export default useReferrals;
