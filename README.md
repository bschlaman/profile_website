# profile website

Install dependencies first-time:
```console
docker run --rm -it -v $PWD/src:/usr/src/app node-app bash
```

Note that currently in the build process, `npm install` does nothing, since `$ROOT/src` ends up being a volume mounted at `/usr/src/app`.  This will probably be fixed for production releases.

## static assets
 - main
 - blog

## TODO
 - make inline code not wrap
