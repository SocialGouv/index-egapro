# EgaPro

## Installer

```bash
yarn
```

## Lancer

One component at time

```bash
yarn dev:api
yarn dev:app
yarn dev:simulateur
yarn dev:declaration
yarn dev:maildev
```

- [api         -> http://localhost:2626](http://localhost:2626)
- [app         -> http://localhost:3000/consulter-index/](http://localhost:3000/consulter-index/)
- [simulateur  -> http://localhost:3001](http://localhost:3001)
- [declaration -> http://localhost:4000](http://localhost:4000)
- [maildev     -> http://localhost:1080](http://localhost:1080)


All in one

```bash
yarn dev
```

## Pour tout arrêter

````bash
docker-compose down # pour arrêter API, déclaration et maildev (ou Ctl-C)
# Ctl-C simulateur
# Ctl-C app
````

## Tests

```bash
yarn check-all
```

## FAQ

__Comment ajouter une librairie dans un workspace__

````bash
yarn workspace simulateur add moment
````

__Comment lancer un script dans un package__

````bash
yarn workspace simulateur run test
````

__Comment lancer un script dans tous les workspaces__

````bash
yarn workspaces run lint
````