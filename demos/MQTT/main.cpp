#include "mbed.h"
#include "NetworkInterface.h"
#include "TCPSocket.h"

#define MQTTCLIENT_QOS1 1
#define MQTTCLIENT_QOS2 1

#include "MQTTNetwork.h"
#include "MQTTmbed.h"
#include "MQTTClient.h"
#define logMessage printf


// Get access to the network interface
NetworkInterface *net = NetworkInterface::get_default_instance();
volatile int arrivedcount = 0;
void messageArrived(MQTT::MessageData& md)
{
    MQTT::Message &message = md.message;
    logMessage("Message arrived: qos %d, retained %d, dup %d, packetid %d\r\n", message.qos, message.retained, message.dup, message.id);
    logMessage("Payload %.*s\r\n", message.payloadlen, (char*)message.payload);
    ++arrivedcount;
    printf("Received MQTT message count: %d\n", arrivedcount);
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
    printf("QOS 0\n");
    char buf[100];
    sprintf(buf, "Hello World!  QoS 0 message from app version %f\r\n", version);
    message.qos = MQTT::QOS0;
    message.retained = false;
    message.dup = false;
    message.payload = (void*)buf;
    message.payloadlen = strlen(buf)+1;
    rc = client.publish(topic, message);
    while (arrivedcount < 1)
    {
        client.yield(100);
        printf("yielded for 100 msec\n");
    }
    printf("QOS 1\n");
    // QoS 1
    sprintf(buf, "Hello World!  QoS 1 message from app version %f\r\n", version);
    message.qos = MQTT::QOS1;
    message.payloadlen = strlen(buf)+1;
    rc = client.publish(topic, message);
    while (arrivedcount < 2)
        client.yield(100);
        
    printf("QOS 2\n");
    // QoS 2
    sprintf(buf, "Hello World!  QoS 2 message from app version %f\r\n", version);
    message.qos = MQTT::QOS2;
    message.payloadlen = strlen(buf)+1;
    rc = client.publish(topic, message);
    while (arrivedcount < 3)
        client.yield(100);
    if ((rc = client.unsubscribe(topic)) != 0)
        logMessage("rc from unsubscribe was %d\r\n", rc);
    if ((rc = client.disconnect()) != 0)
        logMessage("rc from disconnect was %d\r\n", rc);
    mqttNetwork.disconnect();
    logMessage("Version %.2f: finish %d msgs\r\n", version, arrivedcount);
    // Bring down the network interface
    printf("MQTT Finish");
    net->disconnect();
    return 0;
}