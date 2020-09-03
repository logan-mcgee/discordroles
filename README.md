
# discordroles
another attempt at simple discord role authentication.

The standard rule for each export is as follows: 
 - `guild` is an optional value that will take a custom guild ( a guild different to the one defined in your `config.json` )
 - role can be an array/table or a string. if array, it simply checks to see if any of the items match any roles in the users roles.

The current exports available are:
- `isRolePresent(user, role, guild, callback)` / `isRolePresent(user, role, callback)`
- `getUserRoles(user, guild, callback)` / `getUserRoles(user, callback)`
- `getUserData(user, guild, callback)` / `getUserData(user, callback)`
