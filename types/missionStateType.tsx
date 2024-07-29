import { WaitState } from "@/constants/waitStateEnum";

// MissionState type
export default interface MissionState { 
    missionId: string,
    state: WaitState, 
}