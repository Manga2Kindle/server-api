<p align="center">
<a href="https://www.manga2kindle.com/"><img src="https://www.manga2kindle.com/assets/media/hero.png" width="200px" alt="manga2kindle_logo"></a>
<h1 align="center" style="margin: 20px; text-align: center;">Manga2Kindle API</h1>
</p>

### TODO: Known Issues, Issues, new features, dependencies, configuration, installation

## Description 
This is only a REST API, it will handle all calls from the diferent apps and notify the [queue](https://github.com/Manga2Kindle/server-queue) when a chapter is uploaded.

## Usage
Set your `.env` before launching it and run.  
You can check the swagger docs under [localhost:8083/docs](http://localhost:8083/docs), you can also edit this from the `.env`.

## Donations
If you really liked it and feel like I deserve some money, you can buy me a [coffee](https://ko-fi.com/EduFdezSoy) and I'll continue transforming caffeine into code!  

## Copyright
Copyright &copy; 2019 Eduardo Fernandez.  

**Manga2Kindle API** is released under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License; see _LICENSE_ for further details.

---

> An awesome project based on Ts.ED framework

See [Ts.ED](https://tsed.io) project for more information.

## Build setup

> **Important!** Ts.ED requires Node >= 10, Express >= 4 and TypeScript >= 3.

```batch
# install dependencies
$ yarn install

# serve
$ yarn start

# build for production
$ yarn build
$ yarn start:prod
```
