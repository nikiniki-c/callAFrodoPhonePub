
import * as Paho from 'paho-mqtt';


export class MqttHandler {

  client: Paho.Client;
  isConnected: boolean = false;
  setConnectedCallback: ((connected: boolean) => void) | null = null;


  constructor(brokerUrl: string, clientId: string, setConnectedCallback: (connected: boolean) => void) {
    this.client = new Paho.Client(brokerUrl, clientId);
    this.setConnectedCallback = setConnectedCallback;
    this.client.onConnectionLost = (responseObject) => {
      if (responseObject.errorCode !== 0) {
        console.log('Connection lost:', responseObject.errorMessage);
        this.isConnected = false;
        this.connectToMqttBroker();
      }
    };

    this.client.onMessageArrived = (message) => {
      console.log('Message arrived:', message.payloadString);
    };
    this.client.onMessageDelivered = (message) => {
      console.log('Message delivered:', message.payloadString);
    }
  }

  onConnectSuccess() {
    console.log('Connected');
    this.isConnected = true;
  };

  onConnectFailure(error: any) {
    console.error('Connection failed:', error.errorMessage);
    this.isConnected = false;
    
  };

  connectToMqttBroker() {
    console.log('Connecting...');

    const clientOptions = {
      onSuccess: () => {
        this.onConnectSuccess();
        this.setConnectedCallback!(true);
      },
      onFailure: () => {
        console.log('Connection failed');
        console.log('Trying to reconnect...');
        
        this.setConnectedCallback!(false);
        setTimeout(() => {
          this.connectToMqttBroker();
        }, 5000);
      },
      useSSL: false
    }

    this.client.connect(clientOptions);
  };

  sendMessage(topic: string, message: string) {
    console.log("sendMessage aufgerufen: ");
    

    //TODO: Fail Save einbauen, wenn er zwischendurch die Connection verliert!
    console.log(this.client.isConnected());
    
    
    if (!this.client.isConnected()) {
      console.log('Client is not connected');
      return;
    }

      
    const messageObject = new Paho.Message(message);

    messageObject.destinationName = topic;
    messageObject.qos = 1;

    console.log("Nachricht wird gesendet");
    this.client.send(messageObject);
   
  }

  subscribeToTopic(topic: string) {
    this.client.subscribe(topic, {
      onSuccess: () => {
        console.log('Subscribed to topic:', topic);
      },
      onFailure: (error) => {
        console.error('Subscription failed:', error.errorMessage);
      }
    });
  }

  
}