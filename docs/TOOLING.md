# Outillage Claude Code du projet

Outils ajoutés pour travailler sur ce dépôt, après audit (lecture du code, sans
exécution) le 7 octobre 2026. Règles suivies : scope `project` ou `local`,
jamais `user` ; aucune extension payante ; une seule voix de direction
artistique (Frontend Design, complétée par Impeccable pour la critique).

Aucun de ces outils n'est une dépendance du site : rien n'entre dans
`package.json` ni dans le bundle.

## Plugins (déclarés dans `.claude/settings.json`)

| Plugin | Source auditée | Ce qui s'exécute | Désinstaller |
| ------ | -------------- | ---------------- | ------------ |
| `claude-seo` 2.4.2 | `AgriciDaniel/claude-seo` @ `4b99de2` (MIT) | Hook `PostToolUse` sur Edit/Write : `node hooks/run-python-hook.js` → `validate-schema.py` (stdlib uniquement : `json`, `os`, `re`, `sys`, aucun réseau). Valide le JSON-LD des fichiers modifiés. | `claude plugin uninstall claude-seo@agricidaniel-claude-seo --scope project` puis `claude plugin marketplace remove agricidaniel-claude-seo` |
| `frontend-design` | `anthropics/claude-plugins-official` (officiel Anthropic) | Rien : un seul `SKILL.md`, aucun hook. | `claude plugin uninstall frontend-design@anthropic-plugin-directory --scope project` |

**Extensions claude-seo : aucune.** Les extensions (DataForSEO, Ahrefs,
SE Ranking, Firecrawl…) appellent des API payantes : ne pas les installer sans
accord explicite. Le second plugin de la même marketplace, `seo-cockpit`,
n'a pas été audité et n'est pas installé.

`frontend-design` est aussi installé en scope `user` sur la machine de Mathis
(antérieur à cet audit, conservé : sans hook, il ne présente pas de risque et
sert aux autres projets). La déclaration en scope `project` rend ce dépôt
autonome pour quiconque le clone.

> Le binaire `claude` n'est pas dans le PATH (installation via l'extension
> VS Code). Les commandes ci-dessus peuvent être tapées sous forme
> `/plugin …` dans Claude Code, ou avec le binaire de l'extension :
> `~/.vscode/extensions/anthropic.claude-code-<version>-win32-x64/resources/native-binary/claude.exe`.

## Skills copiés (dans `.claude/skills/`, sans plugin ni hook)

| Skill | Source | Remarque | Désinstaller |
| ----- | ------ | -------- | ------------ |
| `webapp-testing` | `anthropics/skills` @ `683bc88` (Apache-2.0) | Scripts Playwright Python, utilisés pour la vérification (captures, reduced-motion, clavier). | `rm -r .claude/skills/webapp-testing` |
| `verification-before-completion` | `obra/superpowers` @ `8ca22db` (MIT) | Copié seul : le plugin `superpowers` n'est **pas** installé, son hook `SessionStart` (injection de consignes à chaque session) est donc absent. | `rm -r .claude/skills/verification-before-completion` |
| `systematic-debugging` | idem | idem | `rm -r .claude/skills/systematic-debugging` |
| `impeccable` | `pbakaus/impeccable` @ `12cddef` (Apache-2.0) | **Sans `scripts/` ni moteur binaire** : le plugin complet télécharge un exécutable dans `~/.impeccable/bin` et le lance via des hooks `SessionStart`/`PostToolUse`/`Stop`. Seuls `SKILL.md` et `reference/` sont copiés ; une note en tête de `SKILL.md` interdit d'exécuter le moteur. | `rm -r .claude/skills/impeccable` |

Les fichiers de licence d'origine sont conservés dans chaque dossier.

## Outils système (hors dépôt)

| Outil | Commande d'installation | Désinstaller |
| ----- | ----------------------- | ------------ |
| Playwright Python 1.63 + Chromium | `pip install playwright` puis `python -m playwright install chromium` | `python -m playwright uninstall --all` puis `pip uninstall playwright pyee greenlet` |

## Écartés après audit

- **ui-ux-pro-max** : doublon de Frontend Design (seconde voix de design),
  7 skills dont certains avec des scripts réseau.
- **web-artifacts-builder** : produit des artifacts claude.ai en un seul
  fichier HTML, hors sujet pour un dépôt Vite.
- **superpowers-skills** (ancien dépôt) : abandonné depuis octobre 2025.
- **Higgsfield** : crédits payants à chaque génération ; risque de faire passer
  un visuel généré pour un vrai projet. Pas d'usage sans accord explicite.
- **Remotion** : non installé à ce stade (optionnel, hors bundle, voir le plan).
