# NgStrapi

[![Angular Console Website](https://img.shields.io/badge/Ng-Strapi-blue.png)](/)

## Instalar

```cmd
npm install ng-strapi
```

## Importar

Importar modulo `NgStrapiModule`

```ts
import { NgStrapiModule } from 'ng-strapi';

@NgModule({
    imports: [
      NgStrapiModule.forRoot(
        'http://localhost:1337', //Url de strapi
        {
          cookie: {
            key: 'jwt',
            options: {
              path: '/'
            }
          },
          localStorage: {
            key: 'jwt'
          }
        });
    ]
})
```

> Se recomienda usar localStorage en `null`

## Usar

```ts
import { AuthService, HttpService } from 'ng-strapi';

constructor(private auth: AuthServiceStrapi, private http: HttpService) {}
```

### Autenticación

#### Local

```ts
this.auth.login(username, password);
```

#### [Providers](https://strapi.io/documentation/guides/authentication.html#providers)

```ts
// Redirija a su usuario a la página de autenticación del proveedor.
window.location = this.auth.getProviderAuthenticationUrl('facebook');
```

Una vez autorizado, el proveedor redirigirá al usuario a su aplicación con un token de acceso en la URL.

```ts
// Complete la autenticación: (El SDK almacenará el token de acceso por usted)
this.auth.authenticateProvider('facebook');
```
