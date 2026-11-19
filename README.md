# Portfolio de Yoan Guillemot

Portfolio de Yoan Guillemot, étudiant en web design (B2) à Digital Campus Paris : maquettes UX/UI, affiches, photographie, le média (hein)fo, la chaîne reCUL et le beatmaking.

En ligne : https://heinf0.github.io/portfolio/

## Structure

```
index.html                      page unique, contenu et données structurées JSON-LD
mentions-legales.html           mentions légales
politique-confidentialite.html  politique de confidentialité (RGPD)
404.html                        page d'erreur servie par GitHub Pages
style.css                   styles (variables, typographie fluide, animations liées au scroll)
main.js                      moteur de scroll, révélations, visionneuse d'images
assets/projects/                visuels WebP (400, 800, 1600 px et taille native)
assets/fonts/                   Anton SC et Archivo, auto hébergées (SIL Open Font License)
assets/*.pdf                    CV et dossier de stratégie reCUL
sitemap.xml, robots.txt
```

## Lancer en local

```
python -m http.server 8000
```

Puis ouvrir http://localhost:8000. Aucune dépendance, aucun build, aucun cookie, aucun service tiers chargé.

## Publication sur GitHub Pages

Le site est prévu pour le dépôt `heinf0/portfolio` (les URL canoniques, le sitemap et la page 404 pointent vers `https://heinf0.github.io/portfolio/`). Pour un autre nom de dépôt, remplacer cette adresse dans `index.html`, `mentions-legales.html`, `politique-confidentialite.html`, `sitemap.xml`, `robots.txt` et la balise `<base>` de `404.html`.

## Sécurité

Chaque page déclare une Content Security Policy stricte (scripts du site uniquement, aucune connexion sortante) et une politique de referrer. GitHub Pages sert le site en HTTPS. Les PDF et images publiés ont été vérifiés : pas de JavaScript embarqué, pas de métadonnées EXIF ou de géolocalisation.

## Droits

Les textes, visuels, photographies et morceaux présentés appartiennent à Yoan Guillemot ou à leurs auteurs respectifs et ne sont pas réutilisables sans accord. Les polices sont distribuées sous SIL Open Font License.
