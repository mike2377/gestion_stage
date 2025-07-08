# Installation et Configuration de Bootstrap et jQuery

## 📦 Dépendances Installées

```bash
npm install bootstrap @popperjs/core jquery @types/jquery
```

### Versions installées :
- **Bootstrap** : 5.3.7
- **jQuery** : 3.7.1
- **@popperjs/core** : 2.11.8
- **@types/jquery** : 3.5.32

## ⚙️ Configuration

### 1. Import dans main.tsx

Les fichiers Bootstrap et jQuery sont automatiquement importés dans `src/main.tsx` :

```typescript
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './config/jquery'
```

### 2. Configuration jQuery

Le fichier `src/config/jquery.ts` rend jQuery disponible globalement :

```typescript
import $ from 'jquery';

// Rendre jQuery disponible globalement
(window as any).$ = $;
(window as any).jQuery = $;

export default $;
```

### 3. Types TypeScript

Le fichier `src/types/global.d.ts` déclare les types globaux pour jQuery :

```typescript
import $ from 'jquery';

declare global {
  interface Window {
    $: typeof $;
    jQuery: typeof $;
  }
}

export {};
```

## 🎨 Utilisation

### Bootstrap

Vous pouvez maintenant utiliser toutes les classes Bootstrap dans vos composants React :

```tsx
function MyComponent() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Titre</h5>
              <p className="card-text">Contenu</p>
              <button className="btn btn-primary">Bouton</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### jQuery

jQuery est disponible globalement via `window.$` ou `window.jQuery` :

```tsx
import { useEffect } from 'react';

function MyComponent() {
  useEffect(() => {
    // Utiliser jQuery
    if (window.$) {
      window.$('.my-element').addClass('active');
    }
  }, []);

  return <div className="my-element">Contenu</div>;
}
```

Ou importer directement :

```tsx
import $ from 'jquery';

function MyComponent() {
  useEffect(() => {
    $('.my-element').addClass('active');
  }, []);

  return <div className="my-element">Contenu</div>;
}
```

## 🚀 Composants Bootstrap Utiles

### Navigation
```tsx
<nav className="navbar navbar-expand-lg navbar-light bg-light">
  <div className="container-fluid">
    <a className="navbar-brand" href="#">Logo</a>
    <div className="navbar-nav">
      <a className="nav-link" href="#">Accueil</a>
      <a className="nav-link" href="#">À propos</a>
    </div>
  </div>
</nav>
```

### Formulaires
```tsx
<form>
  <div className="mb-3">
    <label htmlFor="email" className="form-label">Email</label>
    <input type="email" className="form-control" id="email" />
  </div>
  <button type="submit" className="btn btn-primary">Envoyer</button>
</form>
```

### Tableaux
```tsx
<table className="table table-striped">
  <thead>
    <tr>
      <th>Nom</th>
      <th>Email</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>John Doe</td>
      <td>john@example.com</td>
    </tr>
  </tbody>
</table>
```

### Modals
```tsx
<div className="modal fade" id="myModal" tabIndex={-1}>
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Titre</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div className="modal-body">
        Contenu du modal
      </div>
    </div>
  </div>
</div>
```

## 📚 Ressources

- [Documentation Bootstrap 5](https://getbootstrap.com/docs/5.3/)
- [Documentation jQuery](https://api.jquery.com/)
- [Bootstrap React Components](https://react-bootstrap.github.io/) (optionnel pour des composants React natifs)

## ✅ Test

L'application de test dans `App.tsx` vérifie que Bootstrap et jQuery fonctionnent correctement. Vous devriez voir :
- Une interface stylée avec Bootstrap
- Un message de confirmation dans la console indiquant que jQuery est chargé
- Des classes Bootstrap appliquées (container, row, col, card, etc.) 