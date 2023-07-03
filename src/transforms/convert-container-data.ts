import { PostPatchDeleteOutboundEventContainer, PostPatchDeleteRowDataContainer } from "@/types/row-data-types";

import { filterAndTransformDateAndDatetimeEvents } from "./filter-and-transform-date-and-datetime-events";

/**
 * 
 * @param container 
 * @throws {Error} if key is not in PostPatchDeleteOutboundEventContainer
 * @returns 
 */
export function convertContainerData(container:PostPatchDeleteRowDataContainer){
    const outboundContainer:PostPatchDeleteOutboundEventContainer = {
        patchRowData: [],
        postRowData: [],
        deleteRowData: []
    }
    
    Object.entries(container).forEach(([key, events]) => {
        if (!(key in outboundContainer)){
            throw new Error(`key ${key} not in PostPatchDeeOutboundEventContainer`)
        } 
        const res = filterAndTransformDateAndDatetimeEvents(events)
        outboundContainer[key as keyof PostPatchDeleteOutboundEventContainer] = res
        
    })
    return outboundContainer
}