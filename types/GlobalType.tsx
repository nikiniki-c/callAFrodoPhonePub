import { WaitState } from "@/constants/waitStateEnum";
import { Room } from "./roomType";
import { MqttHandler } from "@/mqtt/mqttHandler";



export interface GlobalType {
    selectedRoom: Room | null;
    trigger: boolean;
    phoneId: string | null;
    mqttHandler: MqttHandler | null;
}