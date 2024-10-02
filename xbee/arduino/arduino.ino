#include <SoftwareSerial.h>
#include <XBee.h>

#define RX_PIN 2
#define TX_PIN 3

#define V1_PIN 7
#define V2_PIN 8


/*
 * Global variables
 */
uint8_t confirm_payload[] = { 'C' };
uint8_t v1_payload[] = { '1', 'C' };
uint8_t v2_payload[] = { '2', 'C' };

XBeeAddress64 addr64 = XBeeAddress64(0x0013a200, 0x41bf6a51);
SoftwareSerial xbeeSerial(RX_PIN, TX_PIN);
XBeeWithCallbacks xbee = XBeeWithCallbacks();
//ZBTxRequest tx = ZBTxRequest(ZB_BROADCAST_ADDRESS, confirm_payload, sizeof(confirm_payload));
ZBTxRequest tx = ZBTxRequest(addr64, confirm_payload, sizeof(confirm_payload));
//ZBRxResponse rx = ZBRxResponse();


void zbResponseCallback(ZBRxResponse &rx, uintptr_t other_data_p) {
  xbee.getResponse().getZBRxResponse(rx);
  uint8_t *data_p = rx.getData();

  if (*data_p == 'X') {  // XBee connection test
    tx.setPayload(confirm_payload, 1);
    Serial.println("X");
  }

  else if (data_p[0] == 'O' && data_p[1] == '1') {
    // Open valve 1
    digitalWrite(V1_PIN, HIGH);
    v1_payload[1] = 'O';
    tx.setPayload(v1_payload, 2);
    Serial.println("O1");
  } else if (data_p[0] == 'O' && data_p[1] == '2') {
    // Open valve 2
    digitalWrite(V2_PIN, HIGH);
    v2_payload[1] = 'O';
    tx.setPayload(v2_payload, 2);
    Serial.println("O2");
  }

  else if (data_p[0] == 'C' && data_p[1] == '1') {
    // Close valve 1
    digitalWrite(V1_PIN, LOW);
    v1_payload[1] = 'C';
    tx.setPayload(v1_payload, 2);
    Serial.println("C1");
  } else if (data_p[0] == 'C' && data_p[1] == '2') {
    // Close valve 2
    digitalWrite(V2_PIN, LOW);
    v2_payload[1] = 'C';
    tx.setPayload(v2_payload, 2);
    Serial.println("C2");
  }

  delay(500);
  xbee.send(tx);
}

void errorCallback(uint8_t err, uintptr_t func_data_p) {
  Serial.print("Error code : ");
  Serial.println(err, 10);
}


/*
 * Setup
 */
void setup() {
  Serial.begin(9600);
  xbeeSerial.begin(9600);
  xbeeSerial.listen();

  xbee.onZBRxResponse(zbResponseCallback, 0);
  xbee.onPacketError(errorCallback, 0);

  pinMode(V1_PIN, OUTPUT);
  pinMode(V2_PIN, OUTPUT);

  xbee.begin(xbeeSerial);
}

/*
 * Main logic
 */
void loop() {
  xbee.loop();
}
