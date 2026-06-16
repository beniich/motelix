# ✅ Checklist QA Complète — Zafir Luxury Hotel Command Center

## 🔐 Authentification
- [ ] Login avec creds valides → redirige vers dashboard
- [ ] Login avec email inexistant → message d'erreur clair
- [ ] Login avec mauvais password → message d'erreur clair
- [ ] Login avec email mal formé → validation côté client
- [ ] Logout → redirige vers `/login` + token cleared
- [ ] Refresh page sur `/login` alors que connecté → redirige vers dashboard
- [ ] Refresh page sur dashboard → reste connecté (token localStorage)
- [ ] Token expiré → auto-refresh transparent ou re-login
- [ ] Tentative accès `/arrivals` sans auth → redirect `/login`
- [ ] Back button après login → comportement normal
- [ ] Session expirée pendant navigation → message clair + re-login

## 🏠 Navigation
- [ ] Tous les onglets de la sidebar sont cliquables
- [ ] Tab actif est visuellement distinct (highlight)
- [ ] Tabs restreints (RBAC) affichent 🔒 icon
- [ ] Click sur tab restreint → ClearanceLock screen
- [ ] Bouton "Shift to Lead Proprietor" → modal + élévation
- [ ] Après élévation, tous les tabs sont accessibles
- [ ] Switch role dans Profile → UI update immédiate
- [ ] URL directe vers tab inexistant → fallback gracieux (redirect ou 404)
- [ ] Browser back/forward fonctionnent correctement
- [ ] Refresh sur n'importe quel tab → reste sur le bon tab

## 📊 Dashboards
- [ ] **Arrivals** : liste affichée, stats correctes, détails cliquables
- [ ] **Arrivals** : check-in fonctionne, statut mis à jour
- [ ] **Arrivals** : check-out fonctionne
- [ ] **Housekeeping** : tâches affichées, filtres marchent
- [ ] **Housekeeping** : start/complete/cancel fonctionnent
- [ ] **Reservations** : table paginée, filtres OK (statut, date, recherche)
- [ ] **Reservations** : détail modal s'ouvre et affiche toutes les infos
- [ ] **Reservations** : cancel fonctionne avec confirmation
- [ ] **Billing** : factures affichées, stats correctes (revenus, impayées)
- [ ] **Billing** : PDF download fonctionne
- [ ] **Billing** : payment recording fonctionne
- [ ] **Guests** : liste affichée, filtres par segment
- [ ] **Guests** : toggle VIP fonctionne
- [ ] **Channels** : canaux affichés avec statuts
- [ ] **Channels** : create/pause/resume/push/pull marchent (mock OK)

## 🔒 RBAC
- [ ] Operator ne voit pas Strategic Intelligence
- [ ] Operator ne voit pas Billing
- [ ] Operator ne voit pas Channel Manager
- [ ] Operator ne voit pas Document Vault
- [ ] Manager (après élévation) voit tous les tabs
- [ ] Modal de confirmation apparaît avant élévation
- [ ] Cooldown 5s fonctionne après élévation
- [ ] Audit log enregistre les actions sensibles

## 🎨 UI/UX
- [ ] Mode Dark : tous les écrans lisibles (texte ≠ noir sur noir)
- [ ] Mode Light : contraste OK partout (texte visible)
- [ ] Mode Cyberpunk : scanlines + particules visibles
- [ ] Mode Luxury : glow subtil visible
- [ ] Hover effects sur cartes et boutons
- [ ] Loading spinners/skeletons visibles (pas de "flash" de contenu vide)
- [ ] Empty states : illustration + texte + CTA
- [ ] Error states : message clair + bouton retry
- [ ] Toasts : apparaissent et disparaissent (avec animation slide-in)
- [ ] Modals : Escape ferme, click outside ferme
- [ ] Forms : validation visuelle, messages d'erreur clairs
- [ ] AnimatedNumber: chiffres s'animent à l'entrée
- [ ] stagger-children: cartes apparaissent progressivement

## 📱 Responsive
- [ ] Mobile (375px) : layout utilisable, pas de scroll horizontal
- [ ] Tablet (768px) : sidebar collapse ou drawer
- [ ] Desktop (1440px) : layout optimal
- [ ] Boutons cliquables au touch (min 44×44px)
- [ ] Texte lisible (min 14px)
- [ ] Pas de texte coupé
- [ ] Tableaux scrollent horizontalement sur mobile

## ⚡ Performance
- [ ] Page load < 4s
- [ ] Dashboard render < 8s
- [ ] API responses < 1s pour les opérations CRUD
- [ ] Charts render smoothly (pas de freeze)
- [ ] Pas de layout shift (CLS) au chargement
- [ ] No console errors/warnings en navigation normale

## 🔒 Sécurité
- [ ] HTTPS forcé (redirect HTTP → HTTPS)
- [ ] CORS configuré correctement (seuls les origines autorisées)
- [ ] Pas de secrets dans le code frontend
- [ ] Rate limiting actif sur `/api/auth/login`
- [ ] Pas de données sensibles dans les logs
- [ ] Headers de sécurité présents (X-Frame-Options, CSP, etc.)

## 🌐 API
- [ ] `GET /api/health` → 200 + `{status: 'ok'}`
- [ ] `POST /api/auth/login` → 200 + tokens
- [ ] `POST /api/auth/login` (bad creds) → 401
- [ ] `GET /api/auth/me` (no auth) → 401
- [ ] `GET /api/auth/me` (with auth) → 200 + user
- [ ] `GET /api/reservations` (no auth) → 401
- [ ] `GET /api/reservations` (with auth) → 200 + list
- [ ] Route inconnue → 404 sans leak d'info

## 🔄 Real-time (WebSocket)
- [ ] WebSocket connects après login
- [ ] Disconnect après logout
- [ ] Nouvelle notification apparaît en temps réel
- [ ] Reconnexion automatique après coupure réseau

## 🌐 Internationalisation
- [ ] Aucun texte codé en dur (tout via i18n ou constantes)
- [ ] Dates formatées correctement (dd/MM/yyyy pour FR)
- [ ] Montants en euros avec bonne localisation

---

> **Last updated:** June 2026  
> **Testers:** QA Team Zafir  
> **Coverage target:** ≥ 90% manual + automated
