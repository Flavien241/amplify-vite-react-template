# 🚀 **GUIDE DE DÉPLOIEMENT COMPLET**

## 🔑 **Étape 1 : Obtenir votre clé API OpenAI**

1. Allez sur https://platform.openai.com/api-keys
2. Connectez-vous ou créez un compte
3. Cliquez "Create new secret key"
4. Copiez la clé (elle commence par `sk-...`)

## 📝 **Étape 2 : Configurer les variables d'environnement**

Créez un fichier `.env` à la racine du projet :

```env
# Clé API OpenAI - OBLIGATOIRE
OPENAI_API_KEY=sk-votre_clé_openai_réelle_ici

# Variables Amplify (optionnelles)
VITE_AMPLIFY_APP_ID=
VITE_AMPLIFY_BRANCH=main
```

⚠️ **IMPORTANT** : Remplacez `sk-votre_clé_openai_réelle_ici` par votre vraie clé !

## 🏗️ **Étape 3 : Déployer l'infrastructure AWS**

```bash
# Installer les dépendances
npm install

# Déployer sur AWS (prend 5-10 minutes)
npx ampx sandbox

# ⏳ Attendez le message "Successfully deployed changes"
```

## ✅ **Étape 4 : Vérifier le déploiement**

Le déploiement est réussi quand vous voyez :

```
✅ Successfully deployed changes
📋 Amplify sandbox console: https://console.aws.amazon.com/...
🌐 GraphQL endpoint: https://xxx.appsync-api.region.amazonaws.com/graphql
🔗 Function URL: https://xxx.lambda-url.region.on.aws/
```

## 🎯 **Étape 5 : Tester l'application**

```bash
# Lancer l'app en parallèle (nouveau terminal)
npm run dev

# Ouvrir http://localhost:5174
```

### **Tests à effectuer :**

1. **🔐 Connexion** : Créez un compte et connectez-vous
2. **📸 Photos** : Uploadez une photo de profil → doit s'afficher instantanément
3. **📝 Tâches** : Créez une tâche (ex: "Développer une app mobile")
4. **🤖 IA** : Cliquez "🤖 Sous-tâches" → doit générer 3-5 sous-tâches intelligentes
5. **💾 Données** : Rafraîchissez la page → tout doit être sauvegardé

## 🔧 **En cas d'erreur**

### **Erreur "OpenAI API key not configured"**

- Vérifiez que le fichier `.env` existe
- Vérifiez que la clé commence par `sk-`
- Redéployez : `npx ampx sandbox`

### **Erreur "Function URL not configured"**

- Attendez la fin complète du déploiement
- Vérifiez dans `amplify_outputs.json` que `custom.generateSubtasksUrl` existe

### **Erreur de permissions S3**

- L'utilisateur doit être connecté pour uploader des photos
- Les photos sont stockées dans `profile-pictures/{username}/`

## 💰 **Coûts AWS estimés**

- **Développement** : ~0,50€/mois (usage léger)
- **Production** : Variable selon le trafic
- **OpenAI** : ~0,002€ par génération de sous-tâches

## 🎉 **Fonctionnalités activées**

✅ **Authentification AWS Cognito** (connexion/inscription)  
✅ **Base de données DynamoDB** (tâches sauvegardées)  
✅ **Stockage S3** (photos de profil dans le cloud)  
✅ **Function Lambda + OpenAI** (génération IA temps réel)  
✅ **Interface React moderne** (responsive, temps réel)

---

🚀 **Votre Todo App avec IA est maintenant COMPLÈTEMENT OPÉRATIONNELLE !**
