import { WaitState } from "@/constants/waitStateEnum";
import { GlobalType } from "../types/GlobalType";

export const global: GlobalType = {
    selectedRoom: null,
    trigger: false,
    phoneId: null,
    mqttHandler: null
}