#include <XBee.h>

#define INT_PIN 2
#define V1_PIN 7
#define V2_PIN 8


/*
 * Global variables
 */
uint8_t confirm_payload[] = { 'C' };
uint8_t v1_payload[] = { '1', 'C' };
uint8_t v2_payload[] = { '2', 'C' };
XBeeAddress64 addr64 = XBeeAddress64(0x0013a200, 0x403e0f30);
XBee xbee = XBee();
ZBTxRequest tx = ZBTxRequest(addr64, confirm_payload, sizeof(confirm_payload));
ZBRxResponse rx = ZBRxResponse();


/*
 * IRQ -> main logic
 */
void IRQ_xbee() {
  if (xbee.getResponse().isAvailable() && xbee.getResponse().getApiId() == RX_64_RESPONSE) {
    xbee.getResponse().getRx64Response(rx);
    uint8_t *data_p = rx.getData();

    if (*data_p == 'X') {  // XBee connection test
      tx.setPayload(confirm_payload);
    }

    else if (data_p[0] == 'O' && data_p[1] == '1') {
      // Open valve 1
      digitalWrite(V1_PIN, HIGH);
      v1_payload[1] = 'O';
      tx.setPayload(v1_payload);
    } else if (data_p[0] == 'O' && data_p[1] == '2') {
      // Open valve 2
      digitalWrite(V2_PIN, HIGH);
      v2_payload[1] = 'O';
      tx.setPayload(v2_payload);
    }

    else if (data_p[0] == 'C' && data_p[1] == '1') {
      // Close valve 1
      digitalWrite(V1_PIN, LOW);
      v1_payload[1] = 'C';
      tx.setPayload(v1_payload);
    } else if (data_p[0] == 'C' && data_p[1] == '2') {
      // Close valve 2
      digitalWrite(V2_PIN, LOW);
      v2_payload[1] = 'C';
      tx.setPayload(v2_payload);
    }

    xbee.send(tx);
  }
}

/*
 * Setup
 */
void setup() {
  // Check if pin is correct
  if (digitalPinToInterrupt(INT_PIN) < 0) {
    while (1);  // Stop program
  }

  Serial.begin(9600);
  xbee.setSerial(Serial);

  pinMode(V1_PIN, OUTPUT);
  pinMode(V2_PIN, OUTPUT);

  attachInterrupt(digitalPinToInterrupt(INT_PIN), IRQ_xbee, LOW);
}

void loop() {
}
