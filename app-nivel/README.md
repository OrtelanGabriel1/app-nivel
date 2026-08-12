# app-nivel

App em React Native (Expo + Expo Router) **em JavaScript/JSX** que usa
o **acelerômetro** do celular como um nível de bolha, indicando se a
superfície onde o aparelho está apoiado está plana.

Gerado seguindo a estrutura de pastas do `npx create-expo-app@latest`.

## Estrutura de pastas

```
app-nivel/
├── app/
│   ├── _layout.jsx      # layout raiz (Expo Router)
│   └── index.jsx        # tela principal
├── components/
│   └── LevelIndicator.jsx  # nível de bolha animado
├── hooks/
│   └── useLevelSensor.js   # leitura e cálculo do acelerômetro
├── assets/
│   └── images/
├── app.json
├── babel.config.js
└── package.json
```

## Como rodar

Importante: **NÃO coloque o projeto dentro de uma pasta sincronizada
pelo OneDrive/Google Drive/Dropbox** — isso causa erros de lock
("ECOMPROMISED") durante o `npm install`.

```bash
npm install
npx expo start
```

Depois abra no app **Expo Go** (Android/iOS) escaneando o QR code, ou
rode em um emulador com `npm run android` / `npm run ios`.

> Sensores físicos (acelerômetro) não funcionam em simuladores iOS nem
> sempre funcionam bem em emuladores Android — teste em um dispositivo
> físico para resultados reais.

## Como funciona

1. `hooks/useLevelSensor.js` assina o `Accelerometer` do pacote
   `expo-sensors` e lê os valores `x`, `y`, `z` (força da gravidade em
   cada eixo, em "g").
2. A partir desses valores calcula dois ângulos de inclinação
   (`tiltX` e `tiltY`) usando `atan2`, convertidos para graus.
3. Se a inclinação total (`tiltTotal`) estiver dentro da tolerância
   definida (padrão: **2°**, em `app/index.jsx`), o app considera a
   superfície **plana** e mostra "PLANO ✔" em verde. Caso contrário,
   mostra "NÃO ESTÁ PLANO" em vermelho.
4. `components/LevelIndicator.jsx` desenha um anel com uma bolha que
   se desloca conforme a inclinação, como um nível de bolha físico.

## Ajustar a sensibilidade

Altere `TOLERANCE_DEG` em `app/index.jsx` (em graus) para tornar a
detecção de "plano" mais rígida (valor menor) ou mais tolerante (valor
maior).
