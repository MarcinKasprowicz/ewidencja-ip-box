# Collect change records for IP BOX 

## Configuration

```
# .env

GITHUB_HOST=https://github.company.io/api/v3
GITHUB_TOKEN=983h297fg392fg
GITHUB_USERNAME=user
```

## Run

```
$ npm install
$ node index.js
```

## Sample result

```
Lp.;Nazwa repozytorium;Nazwa zmiany;Data publikacji;Link URL
1;garmr;chore: Update node requirments in README (#69);2020-02-10T08:55:43Z;https://github.io/f23
2;garmr;Revert "chore: Update node requirments in README (#69)" (#71);2020-02-10T09:45:26Z;https://github.io/f32
...
```