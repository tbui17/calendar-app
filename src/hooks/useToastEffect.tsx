import { toast } from "react-toastify";
import { useEffect } from "react";

type useToastEffectProps = {
    toastMessage: string,
    condition?: boolean,
    dependencies: any[]
}

/**
 * @description useToast is a custom hook that displays a toast message when a condition is met
 * @param toastMessage 
 * @param condition 
 * @param dependencies 
 */
export const useToastEffect = (
    { toastMessage, condition=true, dependencies }: useToastEffectProps
) => {
  useEffect(() => {
    condition && toast(toastMessage)
  }, dependencies);
};