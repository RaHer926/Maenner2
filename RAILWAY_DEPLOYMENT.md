# Railway Deployment Guide

## Voraussetzungen
- Railway Account (https://railway.app)
- GitHub Account (für Code-Upload)
- Railway CLI (optional, für lokales Deployment)

## Deployment-Schritte

### Option 1: Deployment über GitHub (Empfohlen)

1. **Code auf GitHub pushen:**
   - Erstellen Sie ein neues GitHub Repository
   - Pushen Sie den Code:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git remote add origin <YOUR_GITHUB_REPO_URL>
     git push -u origin main
     ```

2. **Railway-Projekt erstellen:**
   - Gehen Sie zu https://railway.app
   - Klicken Sie auf "New Project"
   - Wählen Sie "Deploy from GitHub repo"
   - Wählen Sie Ihr Repository aus

3. **Umgebungsvariablen konfigurieren:**
   - Klicken Sie auf Ihr Deployment
   - Gehen Sie zu "Variables"
   - Fügen Sie folgende Variablen hinzu:
     ```
     RAILWAY_DATABASE_URL=<Ihre bestehende Railway DB URL>
     PORT=3001
     NODE_ENV=production
     ```

4. **Datenbank verbinden:**
   - Ihre PostgreSQL-Datenbank ist bereits vorhanden
   - Railway wird automatisch die RAILWAY_DATABASE_URL verwenden

5. **Deployment starten:**
   - Railway deployed automatisch nach dem ersten Push
   - Jeder weitere Push löst ein neues Deployment aus

### Option 2: Deployment über Railway CLI

1. **Railway CLI installieren:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login:**
   ```bash
   railway login
   ```

3. **Projekt initialisieren:**
   ```bash
   railway init
   ```

4. **Deployment:**
   ```bash
   railway up
   ```

5. **Umgebungsvariablen setzen:**
   ```bash
   railway variables set RAILWAY_DATABASE_URL=<YOUR_DB_URL>
   railway variables set PORT=3001
   railway variables set NODE_ENV=production
   ```

## Nach dem Deployment

1. **Domain konfigurieren:**
   - Gehen Sie zu "Settings" → "Domains"
   - Railway generiert automatisch eine Domain (z.B. `your-app.up.railway.app`)
   - Sie können auch eine Custom Domain hinzufügen

2. **Logs überprüfen:**
   - Klicken Sie auf "Deployments"
   - Wählen Sie das aktuelle Deployment
   - Überprüfen Sie die Logs auf Fehler

3. **Testen:**
   - Öffnen Sie die generierte URL
   - Testen Sie Login, Patienten-Erstellung, Fragebogen

## Wichtige Hinweise

- **Build-Command:** `pnpm install && pnpm build`
- **Start-Command:** `pnpm start`
- **Port:** Der Server bindet an `0.0.0.0` und verwendet `PORT` aus Umgebungsvariablen
- **Datenbank:** Verwendet die bestehende Railway PostgreSQL-Datenbank
- **SSL:** Konfiguriert mit `ssl: false` für Railway-Verbindung

## Troubleshooting

### Deployment schlägt fehl
- Überprüfen Sie die Build-Logs in Railway
- Stellen Sie sicher, dass alle Dependencies in `package.json` sind
- Überprüfen Sie, ob `pnpm` korrekt konfiguriert ist

### Datenbank-Verbindung schlägt fehl
- Überprüfen Sie die RAILWAY_DATABASE_URL
- Stellen Sie sicher, dass die Datenbank online ist
- Überprüfen Sie die SSL-Einstellungen in `database/db.ts`

### Server startet nicht
- Überprüfen Sie die Start-Command in `railway.json`
- Überprüfen Sie die PORT-Konfiguration
- Überprüfen Sie die Server-Logs

## Kosten

Railway bietet:
- **Hobby Plan:** $5/Monat für 500 Stunden Laufzeit
- **Pro Plan:** $20/Monat für unbegrenzte Laufzeit
- Erste $5 sind kostenlos (Trial Credit)

Ihre Anwendung sollte im Hobby Plan laufen können.
