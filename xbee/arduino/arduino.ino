#include <SoftwareSerial.h>
#include <XBee.h>

#define RX_PIN 2
#define TX_PIN 3

// Valves are 1 indexed
#define VALVE_PIN_OFFSET 6
#define V1_PIN 7
#define V2_PIN 8
/* ------------- If other valves are needed : -------------
#define V3_PIN 9
#define V4_PIN 10
#define V5_PIN 11
#define V6_PIN 12
#define V7_PIN 13
*/

#define GET_VALVE_PIN(_p) (_p + VALVE_PIN_OFFSET)
#define GET_VALVE_PIN_CHAR(_p) (GET_VALVE_PIN((uint8_t)_p - 48))

/*
 * Global variables
 */
uint8_t confirm_payload[] = { 'C' };
uint8_t valves_payloads[][2] = {
  { '1', 'C' },
  { '2', 'C' },
  /* ------------- If other valves are needed : -------------
  { '3', 'C' },
  { '4', 'C' },
  { '5', 'C' },
  { '6', 'C' },
  { '7', 'C' },
*/
};

XBeeAddress64 addr64 = XBeeAddress64(0x0013a200, 0x41bf6a51);
SoftwareSerial xbeeSerial(RX_PIN, TX_PIN);
XBeeWithCallbacks xbee = XBeeWithCallbacks();
ZBTxRequest tx = ZBTxRequest(addr64, confirm_payload, sizeof(confirm_payload));


void zbResponseCallback(ZBRxResponse &rx, uintptr_t other_data_p) {
  xbee.getResponse().getZBRxResponse(rx);
  uint8_t *data_p = rx.getData();

  if (*data_p == 'X') {  // XBee connection test
    tx.setPayload(confirm_payload, 1);
  } else {
    uint8_t valve_pin = GET_VALVE_PIN_CHAR(data_p[1]);
    uint8_t valve_index = valve_pin - VALVE_PIN_OFFSET - 1;

    if (data_p[0] == 'O') {
      // Open valve
      digitalWrite(valve_pin, HIGH);
      valves_payloads[valve_index][1] = 'O';
      tx.setPayload(valves_payloads[valve_index], 2);
    } else if (data_p[0] == 'C') {
      // Close valve
      digitalWrite(valve_pin, LOW);
      valves_payloads[valve_index][1] = 'C';
      tx.setPayload(valves_payloads[valve_index], 2);
    }
  }

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

  xbee.onPacketError(errorCallback, 0);
  xbee.onZBRxResponse(zbResponseCallback, 0);

  pinMode(V1_PIN, OUTPUT);
  pinMode(V2_PIN, OUTPUT);
  /* ------------- If other valves are needed : -------------
  pinMode(V3_PIN, OUTPUT);
  pinMode(V4_PIN, OUTPUT);
  pinMode(V5_PIN, OUTPUT);
  pinMode(V6_PIN, OUTPUT);
  pinMode(V7_PIN, OUTPUT);
  */

  xbee.begin(xbeeSerial);
}

void loop() {
  xbee.loop();
}
