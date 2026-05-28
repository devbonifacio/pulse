# ⚡ PULSE

> **Rede social autêntica.** Sem filtros, sem edição — só você no momento real.

Mobile-first app full-stack inspirado no BeReal, construído com **React Native + Node.js + MongoDB + Socket.io**.

---

## ✨ Features

- 🔐 **Autenticação JWT** com bcrypt + persistência local
- 📸 **Câmera real** integrada (frontal/traseira) para o "Momento do Pulso"
- ⚡ **Feed dinâmico** com pulsos que expiram em 24h (TTL no MongoDB)
- 💬 **Chat em tempo real** via Socket.io com indicador "digitando..."
- 🟢 **Status online/offline** sincronizado entre dispositivos
- 😊 **Mood tracker** diário (emoji + cor)
- 🎨 **Dark mode** nativo com identidade visual própria
- 🌐 **Cross-platform**: Web + Android + iOS no mesmo código

---

## 🛠️ Stack

### Frontend
- **React Native** + **Expo SDK 56**
- **expo-router** (file-based navigation)
- **Zustand** (state management)
- **AsyncStorage** (persistência local)
- **Axios** (HTTP)
- **Socket.io-client** (real-time)
- **expo-camera** (câmera nativa)

### Backend
- **Node.js** + **Express**
- **MongoDB Atlas** + **Mongoose**
- **JWT** + **bcryptjs**
- **Socket.io** (WebSocket)

---

## 🚀 Como rodar

### Pré-requisitos
- Node.js 18+
- Conta MongoDB Atlas (free tier funciona)
- Expo Go no celular (opcional)

### Frontend
```bash
cd pulse
npm install
npx expo start
```

### Backend
```bash
cd pulse/server
npm install
# Cria .env (veja .env.example)
npm run dev
```

### Variáveis de ambiente (`server/.env`)
```
MONGO_URI=sua_string_do_mongodb_atlas
JWT_SECRET=qualquer_string_secreta
PORT=3001
```

---

## 📂 Arquitetura

```
pulse/
├── app/                    # Telas (expo-router)
│   ├── (auth)/             # Login + cadastro
│   ├── (tabs)/             # Feed, Pulso, Chat, Perfil
│   └── conversation/[id]   # Tela de conversa
├── components/             # Componentes reutilizáveis (Avatar)
├── store/                  # Zustand stores
├── services/               # Axios + Socket.io
└── server/
    ├── routes/             # Endpoints REST
    ├── models/             # Schemas Mongoose
    ├── middleware/         # JWT auth
    └── socket/             # Eventos real-time
```

---

## 🎨 Identidade visual

| Cor | Hex | Uso |
|-----|-----|-----|
| Background | `#0a0a0a` | Fundo principal |
| Card | `#141414` | Superfícies |
| Roxo primário | `#8B5CF6` | Ações principais |
| Rosa accent | `#EC4899` | Destaques |
| Sucesso | `#10B981` | Status online |
| Erro | `#EF4444` | Logout / erros |

---

## 📝 Roadmap

- [ ] Upload de foto via Cloudinary (em vez de base64)
- [ ] Notificações push (Expo Notifications)
- [ ] Stories estilo Instagram com reações em vídeo
- [ ] Sistema de "Circles" (Íntimos, Amigos, Conhecidos)
- [ ] Mensagens que somem após leitura
- [ ] Deploy em produção (Railway/Render + Vercel)

---

## 👨‍💻 Autor

**Bonifácio Junior** — full-stack dev em construção 🚀

Feito com 💜 e muito café.
