#include "mbed.h"
#include "NetworkInterface.h"
#include "TCPSocket.h"

#define MQTTCLIENT_QOS1 1
#define MQTTCLIENT_QOS2 1

#include "MQTTNetwork.h"
#include "MQTTmbed.h"
#include "MQTTClient.h"
#define logMessage printf

#define WAIT_MS_FOR_MESSAGE 100

/**************************************************************************************

   MQTT Demo - but beware
       - For reasons beyond my understanding TCPSocket's recv function does not timeout.
       Because of this, the yield calls below sometimes never return.
       - I see this as a non-issue because; you should not use busy waiting in your 
        embedded applications anyways. This is merely a demo code.
       - Your best option to make it run towards the finish is to setup your local 
       mosquitto server and publish from a different client so that socket receives
       data and continues.

***************************************************************************************/

// Get access to the network interface
NetworkInterface *net = NetworkInterface::get_default_instance();
volatile int arrivedcount = 0;
void messageArrived(MQTT::MessageData& md)
{
    MQTT::Message &message = md.message;
    logMessage("Message arrived: qos %d, retained %d, dup %d, packetid %d\r\n", message.qos, message.retained, message.dup, message.id);
    logMessage("Payload %.*s\r\n", message.payloadlen, (char*)message.payload);
    ++arrivedcount;
    printf("Received MQTT message count: %d\r\n", arrivedcount);
}
// Socket demo
int main() 
{

    net->connect();
    // Show the network address
    const char *ip = net->get_ip_address();
    const char *mac = net->get_mac_address();
    const char *gateway = net->get_gateway();
    printf("IP address: %s\n", ip ? ip : "None");
    printf("MAC address: %s\n", mac ? mac : "None");
    printf("Gateway: %s\n", gateway ? gateway : "None");

    printf("Starting MQTT Demo\n");
    float version = 0.6;
    char* topic = "cs431";
    MQTTNetwork mqttNetwork(net);
    MQTT::Client<MQTTNetwork, Countdown> client(mqttNetwork);
    const char* hostname = "127.0.0.1";
    int port = 1883;
    logMessage("Connecting to %s:%d\r\n", hostname, port);
    int rc = mqttNetwork.connect(hostname, port);
    if (rc != 0)
        logMessage("rc from TCP connect is %d\r\n", rc);
    MQTTPacket_connectData data = MQTTPacket_connectData_initializer;
    data.MQTTVersion = 3;
    data.clientID.cstring = "mbed-sample";
    data.username.cstring = "testuser";
    data.password.cstring = "testpassword";
    if ((rc = client.connect(data)) != 0)
        logMessage("rc from MQTT connect is %d\r\n", rc);
    if ((rc = client.subscribe(topic, MQTT::QOS2, messageArrived)) != 0)
        logMessage("rc from MQTT subscribe is %d\r\n", rc);
        
    MQTT::Message message;
    // QoS 0
    printf("\r\nQOS 0\r\n");
    char buf[100];
    sprintf(buf, "Hello World!  QoS 0 message from app version %f", version);
    message.qos = MQTT::QOS0;
    message.retained = false;
    message.dup = false;
    message.payload = (void*)buf;
    message.payloadlen = strlen(buf)+1;
    rc = client.publish(topic, message);
    while (arrivedcount < 1)
    {
        client.yield(WAIT_MS_FOR_MESSAGE);
        printf("yielded for %d msec\n", WAIT_MS_FOR_MESSAGE);
    }
    
    printf("\r\nQOS 1\r\n");
    // QoS 1
    sprintf(buf, "Hello World!  QoS 1 message from app version %f", version);
    message.qos = MQTT::QOS1;
    message.payloadlen = strlen(buf)+1;
    rc = client.publish(topic, message);
    while (arrivedcount < 2)
    {
        client.yield(WAIT_MS_FOR_MESSAGE);
        printf("yielded for %d msec\n", WAIT_MS_FOR_MESSAGE);
    }
        
    printf("\r\nQOS 2\r\n");
    // QoS 2
    sprintf(buf, "Hello World!  QoS 2 message from app version %f", version);
    message.qos = MQTT::QOS2;
    message.payloadlen = strlen(buf)+1;
    rc = client.publish(topic, message);
    while (arrivedcount < 3)
    {
        client.yield(WAIT_MS_FOR_MESSAGE);
        printf("yielded for %d msec\n", WAIT_MS_FOR_MESSAGE);
    }
        

    if ((rc = client.unsubscribe(topic)) != 0)
        logMessage("rc from unsubscribe was %d\r\n", rc);
    if ((rc = client.disconnect()) != 0)
        logMessage("rc from disconnect was %d\r\n", rc);
    mqttNetwork.disconnect();
    logMessage("Version %.2f: finish %d msgs\r\n", version, arrivedcount);
    
    // Bring down the network interface
    net->disconnect();
    printf("MQTT Demo finished...\r\n");
    return 0;
}