---
description: REST and GraphQL API documentation on the Settings collection in Directus.
readTime: 3 min read
pageClass: page-reference
---

# Settings

> Settings are key-value pairs that are stored in the database, and control different aspects of the project. Only
> administrators have access to manage Settings.

## The Settings Object

`id` **uuid**\
Primary key of the setting.

`project_name` **string**\
Name of the project, shown in the Admin App.

`project_descriptor` **string**\
Descriptor of the project, shown in the Admin App.

`project_url` **string**\
Link to the (public) website that goes with this project.

`project_color` **string**\
Brand color for the current project.

`project_logo` **many-to-one**\
Primary logo for the current project. Many-to-one to [files](/reference/files).

`public_foreground` **many-to-one**\
Foreground image for the Admin App's public pages. Many-to-one to [files](/reference/files).

`public_background` **many-to-one**\
Background image for the Admin App's public pages. Many-to-one to [files](/reference/files).

`public_note` **string**\
Note shown on the Admin App's public pages. Supports Markdown.

`auth_login_attempts` **integer**\
How often a user is allowed to try to login. After which times the user will be suspended.

`auth_password_policy` **RegEx**\
What regex passwords must pass in order to be valid.

`storage_asset_transform` **string**\
If the transform endpoints are allowed to be used on [the assets endpoint](/reference/files#requesting-a-thumbnail). One
of `all`, `none` or `presets`.

`storage_asset_presets` **array**\
What preset keys exist in [the assets endpoint](/reference/files#requesting-a-thumbnail).

`custom_css` **string**\
CSS rules to override the App's default styling.

`storage_default_folder` **uuid**\
Folder for uploaded files. Does not affect existing files.

`basemaps` **array**\
Custom tiles to overriding the Mapbox defaults.

`mapbox_key` **string**\
[Mapbox Access Token](https://docs.mapbox.com/help/glossary/access-token).

`module_bar` **array**\
What modules are enabled/added globally.

`custom_aspect_ratios` **array**\
Custom aspect ratios in the [image editor](/user-guide/file-library/files#edit-an-image).

```json
{
	"data": {
		"id": 1,
		"project_name": "Directus",
		"project_descriptor": "Application",
		"project_url": null,
		"project_color": null,
		"project_logo": null,
		"public_foreground": null,
		"public_background": null,
		"public_note": null,
		"auth_login_attempts": 25,
		"auth_password_policy": null,
		"storage_asset_transform": "all",
		"storage_asset_presets": [
			{
				"key": "small",
				"fit": "cover",
				"width": 200,
				"height": 161,
				"quality": 80,
				"withoutEnlargement": false
			}
		],
		"custom_css": null,
		"storage_default_folder": null,
		"basemaps": null,
		"mapbox_key": null,
		"module_bar": null,
		"custom_aspect_ratios": [
			{
				"text": "16:10",
				"value": 1.6
			}
		]
	}
}
```

## Retrieve Settings

### Request

<SnippetToggler :choices="['REST', 'GraphQL', 'SDK']" label="API">
<template #rest>

`GET /settings`

</template>
<template #graphql>

`POST /graphql/system`

```graphql
type Query {
	settings: directus_settings
}
```

</template>
<template #sdk>

```js
import { createDirectus, rest, readSettings } from '@directus/sdk';

const client = createDirectus('directus_project_url').with(rest());

const result = await client.request(readSettings());
```

</template>
</SnippetToggler>

#### Query Parameters

Supports all [global query parameters](/reference/query).

### Response

Returns the [settings object](#the-settings-object).

### Example

<SnippetToggler :choices="['REST', 'GraphQL', 'SDK']" label="API">
<template #rest>

`GET /settings`

</template>
<template #graphql>

`POST /graphql/system`

```graphql
query {
	settings {
		project_name
	}
}
```

</template>
<template #sdk>

```js
import { createDirectus, rest, readSettings } from '@directus/sdk';

const client = createDirectus('https://directus.example.com').with(rest());

const result = await client.request(readSettings());
```

</template>
</SnippetToggler>

## Update Settings

### Request

<SnippetToggler :choices="['REST', 'GraphQL', 'SDK']" label="API">
<template #rest>

`PATCH /settings`

Provide a partial [settings object](#the-settings-object) as the body of your request.

</template>
<template #graphql>

`POST /graphql/system`

```graphql
type Mutation {
	update_settings(data: update_directus_settings_input!): directus_settings
}
```

</template>
<template #sdk>

```js
import { createDirectus, rest, updateSettings } from '@directus/sdk';

const client = createDirectus('directus_project_url').with(rest());

const result = await client.request(updateSettings(settings_object));
```

</template>
</SnippetToggler>

#### Query Parameters

Supports all [global query parameters](/reference/query).

#### Request Body

A partial [settings object](#the-settings-object).

### Response

Returns the [settings object](#the-setting-object).

### Example

<SnippetToggler :choices="['REST', 'GraphQL', 'SDK']" label="API">
<template #rest>

`PATCH /settings`

```json
{
	"project_url": "https://example.com/"
}
```

</template>
<template #graphql>

`POST /graphql/system`

```graphql
mutation {
	update_settings(data: { project_url: "https://example.com" }) {
		project_name
		project_url
	}
}
```

</template>
<template #sdk>

```js
import { createDirectus, rest, updateSettings } from '@directus/sdk';

const client = createDirectus('https://directus.example.com').with(rest());

const result = await client.request(
	updateSettings({
		project_url: 'https://example.com/',
	})
);
```

</template>
</SnippetToggler>
