# Homeward Website V6.2.10 — Route Hotfix

## Fixed

- Moved the Stage Five and Stage Six route rules above the wildcard 404 rule.
- Added the missing `/guide/embodied-faith` alias.
- Reorganized all Journey, resource, practice, and guide routes so the wildcard is always last.
- Converted the 404 page's stylesheet, script, image, and navigation references to root-relative URLs.

## Root cause

Netlify processes `_redirects` from top to bottom and uses the first matching rule. In V6.2.8 and V6.2.9, the wildcard `/* /404.html 404` appeared before the new Stage Five and Stage Six rules. Those pages existed, but their redirects were never reached.
