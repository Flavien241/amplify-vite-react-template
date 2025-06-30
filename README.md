## AWS Amplify React+Vite Todo App avec IA

Cette application de gestion de tâches avancée utilise React+Vite et AWS Amplify, avec des fonctionnalités d'intelligence artificielle pour la génération de sous-tâches et de stockage de photos de profil.

## 🚀 Fonctionnalités

- **Authentication** : Authentification sécurisée avec Amazon Cognito
- **API GraphQL** : Endpoint GraphQL en temps réel avec AWS AppSync
- **Base de données** : Stockage en temps réel avec Amazon DynamoDB
- **📸 Photos de profil** : Upload et stockage sécurisé avec AWS S3
- **🤖 Génération IA de sous-tâches** : Décomposition automatique des tâches avec OpenAI et AWS Lambda
- **Interface moderne** : Design responsive avec gestion des tâches et sous-tâches

## 📋 Aperçu des fonctionnalités

### Gestion des tâches

- Créer, supprimer et organiser vos tâches
- Séparation visuelle entre tâches principales et sous-tâches
- Interface utilisateur intuitive avec boutons d'action

### Photos de profil

- Upload de photos avec prévisualisation immédiate
- Stockage sécurisé dans AWS S3 avec permissions par utilisateur
- Rafraîchissement automatique des URLs pré-signées

### Génération IA de sous-tâches

- **Mode démo** : Génération intelligente basée sur des mots-clés
- **Mode OpenAI** : Génération avancée avec ChatGPT (configuration requise)
- Ajout individuel ou en lot des sous-tâches générées

## 🛠️ Installation et configuration

### 1. Installation des dépendances

```bash
npm install
```

### 2. Configuration AWS Amplify

```bash
npx amplify init
npx amplify push
```

### 3. Lancement en mode développement

```bash
npm run dev
```

## 🔧 Configuration avancée

### Pour activer l'IA OpenAI (optionnel)

1. Créez un compte sur [OpenAI](https://platform.openai.com/)
2. Obtenez votre clé API
3. Configurez la variable d'environnement :
   ```bash
   export OPENAI_API_KEY="sk-votre-cle-api-ici"
   ```
4. Redéployez avec `npx amplify push`

### Structure des composants

```
src/
├── components/
│   ├── ProfilePhoto.tsx      # Gestion des photos de profil
│   └── SubtaskGenerator.tsx  # Génération IA de sous-tâches
├── App.tsx                   # Interface principale
└── main.tsx                  # Point d'entrée
```

## 🎯 Utilisation

1. **Connexion** : Créez un compte ou connectez-vous
2. **Photo de profil** : Uploadez votre photo dans la section profil
3. **Tâches** : Créez une nouvelle tâche avec le bouton "Nouvelle tâche"
4. **Sous-tâches** : Cliquez sur "🤖 Sous-tâches" pour générer automatiquement des sous-tâches
5. **Gestion** : Marquez les sous-tâches comme terminées ou supprimez-les

## 📱 Interface utilisateur

L'application propose une interface moderne avec :

- Section profil avec photo personnalisée
- Liste des tâches principales avec compteur
- Section dédiée aux sous-tâches avec code couleur
- Boutons d'action intuitifs avec icônes

## 🔒 Sécurité et permissions

- Authentification multi-facteur disponible avec Cognito
- Stockage des photos avec permissions par utilisateur
- API GraphQL sécurisée avec authentification requise
- Variables d'environnement pour les clés API sensibles

## 🚀 Déploiement vers AWS

Pour des instructions détaillées sur le déploiement, consultez la [section déploiement](https://docs.amplify.aws/react/start/quickstart/#deploy-a-fullstack-app-to-aws) de la documentation AWS Amplify.

```bash
# Déploiement complet
npx amplify publish
```

## 🤝 Contribution

Voir [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) pour plus d'informations sur la contribution au projet.

## 📄 License

Cette application est sous licence MIT-0. Voir le fichier LICENSE.
