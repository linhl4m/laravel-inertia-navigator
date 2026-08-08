# Laravel Inertia Navigator

Quickly navigate from a Laravel route definition to the Inertia page it renders — straight from a `routes/web.php` file, without manually hunting through controllers.

## Features

- **Hover link on routes** — Hovering over a `Route::get(...)` line that points to a controller action (`[Controller::class, 'method']`) shows a **"→ Go to Inertia Page"** link.
- **Go to Page command** — Place the cursor on a route line and run **Laravel Inertia: Go to Page** from the Command Palette (or click the hover link) to jump directly to the rendered Inertia page.
- **Automatic resolution** — The extension resolves the full chain for you:
  1. Finds the controller file (`app/Http/Controllers/{Controller}.php`).
  2. Locates the target method inside it.
  3. Finds the `Inertia::render('Page')` call within that method.
  4. Opens the matching Vue file (`resources/js/Pages/{Page}.vue`).

## Requirements

- A Laravel project using the conventional directory layout:
  - Controllers under `app/Http/Controllers`.
  - Inertia pages under `resources/js/Pages` as `.vue` files.
- Routes defined with the array controller syntax, e.g.:
  ```php
  Route::get('/users', [UserController::class, 'index']);
  ```

## Extension Settings

This extension does not currently contribute any VS Code settings.

## Known Issues

- Only `Route::get(...)` with the `[Controller::class, 'method']` array syntax is recognized.
- On multi-line route definitions, hovering directly over the `Route` keyword does not show the link — hovering over `get` or the rest of the statement does. This is a known bug (see Future Improvements).
- The method boundary is detected by scanning until the next `public function`, so `private`/`protected`/`static` methods declared after the target method can be handled incorrectly.
- The Inertia page path is resolved with a single fixed convention (`resources/js/Pages/{Page}.vue`); other naming conventions or file extensions are not yet supported.

## Future Improvements

- Support for additional Laravel route types:
  - `Route::view(...)`
  - `Route::resource(...)`
  - Closure routes using `Inertia::render(...)`
- Only show the hover link when navigation to an Inertia page is actually possible (Controller → Method → `Inertia::render(...)` successfully resolved).
- More robust method-boundary detection: instead of stopping at the next `public function`, determine the end of a method by matching curly braces (`{` / `}`). This will make `private`, `protected`, and `public static` methods work correctly too.
- Smarter Inertia page resolution (e.g. matching both `Users.vue` and `Users/Index.vue`, and additional file extensions such as `.jsx` or `.tsx`).
- Hover over the entire route instead of only parts of it (mark the full multi-line route as the hover range). This already works in most cases, but on multi-line routes, hovering over just `Route` currently does not show "Go to Inertia Page", while hovering over `get` or the rest of the statement does — this needs to be fixed.
- More precise error messages (controller not found, method not found, no `Inertia::render()`, page file not found).

## Release Notes

### 0.0.1

Initial release:
- Hover provider and "Go to Page" command for `Route::get(...)` controller actions.
- Automatic resolution from route → controller method → Inertia page.

**Enjoy!**
