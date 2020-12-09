#include "mbed.h"

DigitalOut led1(LED1);
DigitalOut led2(LED2);
DigitalOut led3(LED3);

Ticker t1;
Timeout t2;
InterruptIn btn(BUTTON1);
Timer t;

void blink_led1() {
    printf("Ticker fired at %dms\n", t.read_ms());
    led1 = !led1;
}

void toggle_led2() {
    printf("BUTTON1 fall at invoked at %dms\n", t.read_ms());
    led2 = !led2;
    t.reset();
    printf("Timer reset. Now is %dms\n", t.read_ms());
}

void turn_led3_on() {
    printf("Timeout fired at %dms\n", t.read_ms());
    led3 = 1;
}

int main() {
    t.start();
    printf("Hello world!\n");
    printf("LED1 will blink every second, LED3 will toggle after 2.5 seconds, LED2 can be toggled through BUTTON1.\n");
    printf("-----------------------------------\n\n");

    t1.attach(callback(&blink_led1), 1.0f);
    t2.attach(callback(&turn_led3_on), 2.5f);
    btn.fall(callback(&toggle_led2));

    wait_ms(osWaitForever);
}
