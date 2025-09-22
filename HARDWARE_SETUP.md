# Sistema de Puntuación Pádel - Configuración Hardware

## Componentes Necesarios

### Raspberry Pi 3B
- Raspberry Pi 3B o superior
- Tarjeta SD 32GB (Clase 10)
- Fuente de alimentación 5V/2.5A
- Cable HDMI para conexión a TV
- Carcasa (opcional pero recomendado)

### ESP32 con Sensores
- ESP32 DevKit v1 o similar
- 2x Sensor de presencia LD2410C (mmWave radar)
- 2x LED RGB WS2812B o similar
- Cables jumper
- Protoboard o PCB personalizada
- Fuente de alimentación 5V para ESP32

## Conexiones ESP32

### Sensor LD2410C (Equipo 1)
```
ESP32          LD2410C
GPIO 16 (RX2)  → TX
GPIO 17 (TX2)  → RX
3.3V           → VCC
GND            → GND
```

### Sensor LD2410C (Equipo 2)
```
ESP32          LD2410C
GPIO 4         → TX (via SoftwareSerial)
GPIO 5         → RX (via SoftwareSerial)
3.3V           → VCC
GND            → GND
```

### LED RGB (Equipo 1)
```
ESP32          LED RGB
GPIO 18        → Data In
5V             → VCC
GND            → GND
```

### LED RGB (Equipo 2)
```
ESP32          LED RGB
GPIO 19        → Data In
5V             → VCC
GND            → GND
```

## Código ESP32

```cpp
#include <WiFi.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>
#include <FastLED.h>

#define LED_PIN_1 18
#define LED_PIN_2 19
#define NUM_LEDS 1
#define LD2410_RX1 16
#define LD2410_TX1 17
#define LD2410_RX2 4
#define LD2410_TX2 5

CRGB leds1[NUM_LEDS];
CRGB leds2[NUM_LEDS];

HardwareSerial ld2410_1(1);
HardwareSerial ld2410_2(2);

WebSocketsClient webSocket;

void setup() {
  Serial.begin(115200);
  
  // Configurar LEDs
  FastLED.addLeds<WS2812B, LED_PIN_1, GRB>(leds1, NUM_LEDS);
  FastLED.addLeds<WS2812B, LED_PIN_2, GRB>(leds2, NUM_LEDS);
  
  // Configurar sensores
  ld2410_1.begin(256000, SERIAL_8N1, LD2410_RX1, LD2410_TX1);
  ld2410_2.begin(256000, SERIAL_8N1, LD2410_RX2, LD2410_TX2);
  
  // Conectar WiFi (AP de Raspberry Pi)
  WiFi.begin("PadelScore_AP", "padelscore123");
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Conectando WiFi...");
  }
  
  // Configurar WebSocket
  webSocket.begin("192.168.4.1", 3001, "/");
  webSocket.onEvent(webSocketEvent);
  
  // Colores iniciales (azul y rojo)
  leds1[0] = CRGB::Blue;
  leds2[0] = CRGB::Red;
  FastLED.show();
}

void loop() {
  webSocket.loop();
  
  // Leer sensores LD2410C
  if (checkSensor(ld2410_1, 1)) {
    sendPoint("team1");
    flashGreen(1);
  }
  
  if (checkSensor(ld2410_2, 2)) {
    sendPoint("team2");
    flashGreen(2);
  }
  
  delay(100);
}

bool checkSensor(HardwareSerial &sensor, int sensorNum) {
  // Lógica para leer datos del LD2410C
  // Detectar presencia por 2 segundos = punto
  // Detectar presencia por 5 segundos = undo
  // Implementar según protocolo LD2410C
  return false; // Placeholder
}

void sendPoint(String team) {
  DynamicJsonDocument doc(200);
  doc["action"] = "point";
  doc["team"] = team;
  
  String message;
  serializeJson(doc, message);
  webSocket.sendTXT(message);
}

void flashGreen(int ledNum) {
  if (ledNum == 1) {
    leds1[0] = CRGB::Green;
  } else {
    leds2[0] = CRGB::Green;
  }
  FastLED.show();
  
  delay(500);
  
  // Volver al color original
  leds1[0] = CRGB::Blue;
  leds2[0] = CRGB::Red;
  FastLED.show();
}

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  // Manejar eventos del WebSocket
}
```

## Configuración Raspberry Pi

### 1. Preparar Sistema Operativo
```bash
# Instalar Raspberry Pi OS Lite
# Habilitar SSH y configurar WiFi

# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar dependencias del sistema
sudo apt install -y hostapd dnsmasq
```

### 2. Configurar Access Point
```bash
# /etc/hostapd/hostapd.conf
interface=wlan0
driver=nl80211
ssid=PadelScore_AP
hw_mode=g
channel=7
wmm_enabled=0
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase=padelscore123
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP

# /etc/dnsmasq.conf
interface=wlan0
dhcp-range=192.168.4.2,192.168.4.20,255.255.255.0,24h
```

### 3. Configurar aplicación
```bash
# Clonar y configurar la aplicación
git clone <repository>
cd padel-scoring-system
npm install
npm run build

# Configurar como servicio systemd
sudo cp padel-score.service /etc/systemd/system/
sudo systemctl enable padel-score
sudo systemctl start padel-score
```

### 4. Configuración de pantalla
```bash
# /boot/config.txt
hdmi_force_hotplug=1
hdmi_group=2
hdmi_mode=82  # 1920x1080 60Hz
hdmi_drive=2
```

## Posicionamiento Físico

### Instalación en Cancha
1. **Sensores LD2410C**: Montar en postes a 1.2m de altura, uno en cada lado de la red
2. **LEDs RGB**: Visibles desde ambos lados de la cancha
3. **Raspberry Pi**: En lugar protegido, cerca de toma de corriente
4. **TV**: Montada en pared o soporte móvil, visible desde toda la cancha

### Consideraciones
- Proteger equipos de la intemperie
- Cables de alimentación seguros
- Señalización clara de los sensores
- Acceso fácil para mantenimiento

## Configuración de Red

La Raspberry Pi crea un Access Point con:
- **SSID**: PadelScore_AP
- **Password**: padelscore123
- **IP**: 192.168.4.1

Los dispositivos móviles se conectan a esta red para acceder a la configuración en `http://192.168.4.1`

## Mantenimiento

1. **Limpieza regular** de sensores y LEDs
2. **Verificación de conexiones** semanalmente
3. **Backup de configuraciones** mensualmente
4. **Actualización de software** según necesidad

## Solución de Problemas

### ESP32 no conecta
- Verificar credenciales WiFi
- Revisar alimentación
- Comprobar conexiones de sensores

### Sensores no detectan
- Ajustar sensibilidad LD2410C
- Verificar posicionamiento
- Comprobar comunicación serie

### TV no muestra imagen
- Verificar cable HDMI
- Revisar configuración de resolución
- Comprobar fuente de alimentación Pi