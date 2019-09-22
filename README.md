# NgStrapi

[![Angular Console Website](https://img.shields.io/badge/Ng-Strapi-blue.png)](https://github.com/adrian-ub/ng-strapi)

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

## Datos

Ahora puede buscar API privadas

```ts
this.http.getEntries<User>('users').subscribe(users => {
  //Aquí trate sus datos
});
```

## API

### Autenticación API

```ts
register(data: any): Observable<Authentication>

login(identifier: string, password: string): Observable<Authentication>

getCurrentUser<T>(): Observable<T>

isAuthenticated(): boolean

logout(): boolean

forgotPassword(email: string, url: string)

resetPassword(code: string, password: string, passwordConfirmation: string)

getProviderAuthenticationUrl(provider: Provider): string

authenticateProvider(provider: Provider, params?: ProviderToken): Observable<Authentication>
```

### Http

```ts
getEntries<T>(contentTypePluralized: string, params?: HttpParams): Observable<T[]>

getEntryCount(contentType: string, params?: HttpParams): Observable<number>

getEntry<T>(contentTypePluralized: string, id: string): Observable<T>

createEntry<T>(contentTypePluralized: string, data: T, params?: HttpParams): Observable<T>

updateEntry<T>(contentTypePluralized: string, id: string, data: T, params?: HttpParams): Observable<T>

deleteEntry<T>(contentTypePluralized: string, id: string): Observable<T>

searchFiles(query: string): Observable<File>

getFiles(params?: HttpParams): Observable<File[]>

getFile(id: string): Observable<File>

upload(data: FormData, params?: HttpParams): Observable<File>

```
